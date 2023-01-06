import { useState } from "react"
import { Switch, Table, TableColumnProps, Button, Modal, Input, Form, Popconfirm } from "antd"

import { v4 } from "uuid"

import styles from "./styles.module.scss"

import storage, { saveStorage, removeStorage, editCheckedStorage } from "@/utils/localstorage"

type tableDataProps = {
  uuid: string
  name: string
  source: string
  target: string
  checked: boolean
}

const initialProxyData = {
  name: "",
  source: "",
  target: "",
  uuid: "",
  checked: false
}

function Proxy() {
  const columns: TableColumnProps<tableDataProps>[] = [
    {
      title: "名称",
      dataIndex: "name"
    },
    {
      title: "来源",
      dataIndex: "source"
    },
    {
      title: "目标",
      dataIndex: "target"
    },
    {
      title: "操作",
      align: "center",
      render: (value, record) => {
        return (
          <div>
            <Popconfirm title="确定删除当前规则!" okText="确定" cancelText="取消" onConfirm={() => removeRule(record.uuid)}>
              <Button type="link">删除</Button>
            </Popconfirm>

            <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.checked} onChange={(checked: boolean) => changeSwitch(checked, record.uuid)}></Switch>
          </div>
        )
      }
    }
  ]

  const proxyData = (): tableDataProps[] => {
    const data = storage("proxy", "[]")
    return JSON.parse(data)
  }

  const [data, setData] = useState<tableDataProps[]>(proxyData())

  const [open, setOpen] = useState<boolean>(false)
  const [newRuleData, setRuleData] = useState(initialProxyData)

  const showModal = () => {
    setRuleData({ ...initialProxyData, uuid: v4() })
    setOpen(true)
  }

  const hideModal = () => {
    setRuleData({ ...initialProxyData })
    setOpen(false)
  }

  const okModal = () => {
    saveStorage("proxy", newRuleData)
    setData(proxyData())
    setOpen(false)
  }

  const changeRule = (value: string, type: string): void => {
    setRuleData({ ...newRuleData, [type]: value })
  }

  const removeRule = (uuid: string): void => {
    removeStorage("proxy", uuid)
    setData(proxyData())
  }

  const changeSwitch = (value: boolean, uuid: string): void => {
    console.log(value, uuid)
    editCheckedStorage("proxy", value, uuid)
    setData(proxyData())
  }

  return (
    <div className={styles["proxy-box"]}>
      <div className={styles["new-proxy"]}>
        <Button type="primary" size="small" onClick={showModal}>
          新建规则
        </Button>
      </div>
      <div>
        <Table dataSource={data} columns={columns} bordered size="small" rowKey="uuid"></Table>
        <Modal title="新增规则" open={open} onOk={okModal} onCancel={hideModal} okText="确认" cancelText="取消">
          <div>
            <Form colon={false}>
              <Form.Item label="名称">
                <Input value={newRuleData.name} onChange={(event) => changeRule(event.target.value, "name")} />
              </Form.Item>

              <Form.Item label="来源">
                <Input value={newRuleData.source} onChange={(event) => changeRule(event.target.value, "source")} />
              </Form.Item>

              <Form.Item label="目标">
                <Input value={newRuleData.target} onChange={(event) => changeRule(event.target.value, "target")} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Proxy
