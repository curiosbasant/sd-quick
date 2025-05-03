export async function dispatchAction<I, O>(action: {
  type: string | number
  payload?: I
  tabId?: number
}) {
  const tabId =
    action.tabId ??
    (await chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => tab.id))

  return new Promise<O>((resolve, reject) =>
    tabId
      ? chrome.tabs.sendMessage(tabId, { type: action.type, payload: action.payload }, resolve)
      : reject('Tab not found')
  )
}

export async function dispatchBackgroundAction<T>(action: string, payload?: T) {
  return new Promise((resolve) => chrome.runtime.sendMessage({ action, payload }, resolve))
}
