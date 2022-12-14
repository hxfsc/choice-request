import { Switch, Space, Alert, Button, Input } from "antd"
import { useState, useEffect } from "react"

import localStorage, { saveStorage, proxyOrStorage, initDataProps, saveStorageSingle } from "@/utils/localstorage"
import styles from "./styles.module.scss"

const { TextArea } = Input

const postName = "pop-connect"

const sendMessage = (callback: Function) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs: any[]) => {
    const currentPost: chrome.runtime.Port = chrome.tabs.connect(tabs[0]?.id, { name: postName })
    callback(currentPost)
  })
}



function PopupConfig() {
  const [lookUp, setLookUp] = useState<boolean>(false)
  const [storage, setStorage] = useState<string>("")

  const intoSetting = () => {
    chrome.tabs.create({
      url: "options/index.html"
    })
  }

  const lookStorage = () => {
    sendMessage((post: chrome.runtime.Port) => {
      post.postMessage({ source: "get-storage" })
      post.onMessage.addListener((data) => {
        const storage = JSON.stringify(data)
        setStorage(storage)
        setLookUp(true)
      })
    })
  }

  const backupStorage = () => {
    sendMessage((post: chrome.runtime.Port) => {
      post.postMessage({ source: "backup" })
      post.onMessage.addListener((data) => {
        saveStorage("backup", data)
      })
    })
  }

  const [initData, setInitData] = useState<initDataProps>({})
  useEffect(() => {
    const { proxy, storage } = proxyOrStorage()
    setInitData({ ...initData, proxy, storage })
  }, [])


  const [using, setUsing] = useState<{isProxy?: boolean, isStorage?: boolean}>({})

  const getUsing = () :void =>{
    const isProxy = JSON.parse(localStorage('isProxy', "false"))
    const isStorage = JSON.parse(localStorage('isStorage', "false"))
    setUsing({isProxy, isStorage})
  }

  useEffect(()=>{
    getUsing()
  }, [])

  const changeUsing = ( key: "isProxy"|"isStorage", value: boolean): void =>{
    saveStorageSingle(key, JSON.stringify(value))
    getUsing()
  }


  return (
    <div className={styles["popup-wrapper"]}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <div className={styles["alert-tips"]}>
          <Alert
            type="success"
            message={
              <div>
                {initData.proxy?.checked ? (
                  <div>
                    ??????????????????????????????[{initData.proxy.name}]??? {initData.proxy.source} ????????? {initData.proxy.target}
                  </div>
                ) : (
                  <div>???????????????????????????</div>
                )}

                <div>{initData.storage?.checked ? <span>????????????storage [{initData.storage.name}] </span> : <span>???????????????storage</span>}</div>
                <Button type="link" size="small" onClick={intoSetting}>
                  ????????????
                </Button>
              </div>
            }
          ></Alert>
        </div>

        <div className={styles["configure-item"]}>
          <span>??????????????????</span>
          <Switch checkedChildren="??????" unCheckedChildren="??????" checked={using.isProxy} onChange={(checked:boolean)=> changeUsing('isProxy', checked)}></Switch>
        </div>

        <div className={styles["configure-item"]}>
          <span>?????????????????????storage</span>
          <Switch checkedChildren="??????" unCheckedChildren="??????" checked={using.isStorage} onChange={(checked: boolean)=> changeUsing('isStorage', checked)}></Switch>
        </div>

        <div className={styles["configure-item"]}>
          <span>?????????????????????????????????Storage</span>
          <div>
            <Button type="link" onClick={() => backupStorage()}>
              ??????
            </Button>
            {!lookUp ? (
              <Button type="link" onClick={() => lookStorage()}>
                ??????
              </Button>
            ) : (
              <Button type="link" onClick={() => setLookUp(false)}>
                ??????
              </Button>
            )}
          </div>
        </div>

        {lookUp && (
          <div>
            <TextArea rows={8} value={storage} />
          </div>
        )}
      </Space>
    </div>
  )
}

export default PopupConfig
