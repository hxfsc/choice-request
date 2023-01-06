import storage, { proxyOrStorage } from "../src/utils/localstorage"

const transformUrl = (url: string): string => {
  const isProxy = storage("isProxy", "false")
  const { proxy } = proxyOrStorage()

  if (!proxy) {
    return url
  }

  let newUrl = url
  const { source = "", target = "" } = proxy
  const isExistUrl = source && target

  if (isProxy && isExistUrl) {
    newUrl = url.replace(source, target)
  }
  return newUrl
}

const webRequest = (details) => {
  // cancel 表示取消本次请求  {cancel: true}

  let { url, method } = details
  url = transformUrl(url)
//   return { redirectUrl: url}
}

chrome.webRequest.onBeforeRequest.addListener(webRequest, { urls: ["<all_urls>"] }, ["blocking", "requestBody", "extraHeaders"])
