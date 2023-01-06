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
                    当前选中地址代理地址[{initData.proxy.name}]由 {initData.proxy.source} 切换为 {initData.proxy.target}
                  </div>
                ) : (
                  <div>当前未选中地址代理</div>
                )}

                <div>{initData.storage?.checked ? <span>当前选中storage [{initData.storage.name}] </span> : <span>当前未选中storage</span>}</div>
                <Button type="link" size="small" onClick={intoSetting}>
                  进入配置
                </Button>
              </div>
            }
          ></Alert>
        </div>

        <div className={styles["configure-item"]}>
          <span>是否开启代理</span>
          <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={using.isProxy} onChange={(checked:boolean)=> changeUsing('isProxy', checked)}></Switch>
        </div>

        <div className={styles["configure-item"]}>
          <span>是否启用自定义storage</span>
          <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={using.isStorage} onChange={(checked: boolean)=> changeUsing('isStorage', checked)}></Switch>
        </div>

        <div className={styles["configure-item"]}>
          <span>查看当前页面正在使用的Storage</span>
          <div>
            <Button type="link" onClick={() => backupStorage()}>
              备份
            </Button>
            {!lookUp ? (
              <Button type="link" onClick={() => lookStorage()}>
                查看
              </Button>
            ) : (
              <Button type="link" onClick={() => setLookUp(false)}>
                关闭
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
