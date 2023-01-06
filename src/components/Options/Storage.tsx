import { Switch, Table, TableColumnProps, Button, Modal, Form, Input } from "antd"
import { useState } from "react"
import dayjs from "dayjs"
import { v4 } from "uuid"
import omit from "lodash/omit"

import styles from "./styles.module.scss"

import storage, { saveStorage, removeStorage, editCheckedStorage, findStorage, editStorage, storageProps } from "../../utils/localstorage"

const { TextArea } = Input

const initialStorage: storageProps = {
  name: "",
  value: "",
  datetime: "",
  checked: false,
  uuid: ""
}

function Storage() {
  const columns: TableColumnProps<storageProps>[] = [
    {
      title: "名称",
      dataIndex: "name"
    },
    {
      title: "时间",
      dataIndex: "datetime"
    },
    {
      title: "操作",
      align: "center",
      render: (value, record, index) => {
        return (
          <div>
            <Button type="link" onClick={() => del(record.uuid)}>
              删除
            </Button>
            <Button type="link" onClick={() => eidtStorage(record.uuid)}>
              编辑
            </Button>
            <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={record.checked} onChange={(checked: boolean) => changeSwitch(checked, record.uuid)}></Switch>
          </div>
        )
      }
    }
  ]

  const [data, setData] = useState<storageProps[]>(JSON.parse(storage("storage", "[]")))

  const [open, setOpen] = useState<boolean>(false)

  const [newStorage, setNewStorage] = useState<storageProps>({ ...initialStorage, uuid: v4() })

  const showOpen = () => {
    setNewStorage({ ...initialStorage, datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"), uuid: v4(), type: "ADD" })
    setOpen(true)
  }

  const hideOpen = () => setOpen(false)
  const okOpen = () => {
    if (newStorage.type == "ADD") {
      saveStorage("storage", omit(newStorage, "type"))
    } else {
      editStorage("storage", omit(newStorage, "type"))
    }

    setData(JSON.parse(storage("storage", "[]")))
    setOpen(false)
  }

  const changeStorage = (value: string, type: string): void => {
    setNewStorage({ ...newStorage, [type]: value })
  }

  const del = (uuid: string): void => {
    removeStorage("storage", uuid)
    setData(JSON.parse(storage("storage", "[]")))
  }

  const eidtStorage = (uuid: string): void => {
    const storage = findStorage("storage", uuid)
    if (storage) {
      setNewStorage({ ...storage, type: "EDIT" })
    }
    setOpen(true)
  }

  const changeSwitch = (checked: boolean, uuid: string): void => {
    editCheckedStorage("storage", checked, uuid)
    setData(JSON.parse(storage("storage", "[]")))
  }

  return (
    <div className={styles["storage-box"]}>
      <div className={styles["new-storage"]}>
        <Button size="small" type="primary" onClick={showOpen}>
          新建
        </Button>
      </div>
      <div>
        <Table dataSource={data} columns={columns} bordered size="small"></Table>

        <Modal title={`${newStorage.type == "ADD" ? "新增" : "编辑"}Storage`} okText="确认" cancelText="取消" open={open} onOk={okOpen} onCancel={hideOpen}>
          <div className={styles["storage-modal-body"]}>
            <Form labelAlign="right" labelCol={{ span: 4 }}>
              <Form.Item label="名称">
                <Input value={newStorage.name} onChange={(event) => changeStorage(event.target.value, "name")} />
              </Form.Item>
              <Form.Item label="Storage">
                <TextArea rows={8} value={newStorage.value} onChange={(event) => changeStorage(event.target.value, "value")} />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Storage
