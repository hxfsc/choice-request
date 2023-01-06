const bg = chrome.extension.getBackgroundPage()

const storage = (key: string, initial: string = "[]"): string => bg?.localStorage[key] ?? initial


export const saveStorageSingle = (key: string, value: string):void=>{
    bg?.localStorage.setItem(key, value)
}

export const saveStorage = (key: string, value: object) => {
  const store = storage(key, "[]")
  let newStore = JSON.parse(store)
  newStore = [...newStore, value]
  bg?.localStorage.setItem(key, JSON.stringify(newStore))
}

export const removeStorage = (key: string, uuid: string) => {
  const store = storage(key, "[]")
  let newStore = JSON.parse(store)
  newStore = newStore?.filter((item: { uuid: string }) => item.uuid != uuid)
  bg?.localStorage.setItem(key, JSON.stringify(newStore))
}

export const editCheckedStorage = (key: string, checked: boolean, uuid: string): void => {
  const store = storage(key, "[]")
  let newStore = JSON.parse(store)
  newStore = newStore
    .map((item: { checked: boolean }) => ({ ...item, checked: false }))
    .map((item: { checked: boolean; uuid: string }) => {
      if (item.uuid == uuid) {
        item.checked = checked
      }

      return item
    })
  bg?.localStorage.setItem(key, JSON.stringify(newStore))
}

export type storageProps = {
  name: string
  value: string
  datetime: string
  checked: boolean
  uuid: string
  source?: string
  target?: string
  type?: "ADD" | "EDIT"
}

export const editStorage = (key: string, data: storageProps): void => {
  const store = storage(key, "[]")
  let newStore = JSON.parse(store)
  newStore = newStore.map((item: storageProps) => {
    if (item.uuid == data.uuid) {
      return data
    }
    return item
  })

  bg?.localStorage.setItem(key, JSON.stringify(newStore))
}

export const findStorage = (key: string, uuid: string): storageProps | null => {
  const store = storage(key, "[]")
  const newStore = JSON.parse(store)
  const current = newStore.find((item: storageProps) => item.uuid == uuid)
  return current
}

export type initDataProps = {
  proxy?: Pick<storageProps, "target" | "source" | "checked" | "name">
  storage?: Pick<storageProps, "checked" | "name">
}

export const proxyOrStorage = () => {
  const proxiesJson = storage("proxy", "[]")
  const proxies = JSON.parse(proxiesJson) as unknown as storageProps[]
  const proxy = proxies?.find((proxy: storageProps) => proxy.checked)

  const storageJson = storage("storage", "[]")
  const storages = JSON.parse(storageJson) as unknown as storageProps[]
  const _storage = storages?.find((storage: storageProps) => storage.checked)
  return { proxy, storage: _storage }
}

export default storage
