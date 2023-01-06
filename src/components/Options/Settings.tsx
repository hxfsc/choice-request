import { Alert, Radio, CheckboxOptionType, RadioChangeEvent } from "antd"

import styles from "./styles.module.scss"

import Storage from "./Storage"
import Proxy from "./Proxy"

import { proxyOrStorage, initDataProps } from "@/utils/localstorage"

import { useEffect, useState } from "react"

enum CATEGORY_ENUM {
  PROXY,
  STORAGE
}

const radios: CheckboxOptionType[] = [
  {
    label: "代理",
    value: CATEGORY_ENUM.PROXY
  },
  {
    label: "Storage",
    value: CATEGORY_ENUM.STORAGE
  }
]

function OptionsSettings() {
  const [category, setCategory] = useState<CATEGORY_ENUM>(CATEGORY_ENUM.PROXY)
  const changeRadio = (value: CATEGORY_ENUM): void => {
    setCategory(value)
  }

  const [initData, setInitData] = useState<initDataProps>({})

  useEffect(() => {
    const { proxy, storage } = proxyOrStorage()
    setInitData({ ...initData, proxy, storage })
  }, [])


  return (
    <div className={styles["options-wrapper"]}>
      <div className={styles["alert-tips"]}>
        <Alert
          type="success"
          message={
            <div>
              <div>
                {initData.proxy?.checked ? (
                  <div>
                    当前地址代理地址由 {initData.proxy.source} 切换为 {initData.proxy.target}{" "}
                  </div>
                ) : (
                  "当前未启用代理地址"
                )}
              </div>
              <div>{initData.storage?.checked ? <div>当前启用自定义storage[{initData.storage.name}]</div> : "未启用自定义storage"}</div>
            </div>
          }
        ></Alert>
      </div>

      <div className={styles["pages"]}>
        <Radio.Group options={radios} optionType="button" buttonStyle="solid" value={category} onChange={(event: RadioChangeEvent): void => changeRadio(event.target.value)} />
        {category === CATEGORY_ENUM.PROXY ? <Proxy /> : <Storage />}
      </div>
    </div>
  )
}

export default OptionsSettings
