import { actions, onRuntimeMessage } from './utils'
import { dispatchAction } from '../src/utils'

onRuntimeMessage(async (message, sender) => {
  console.log('background: request received', { message, sender })
  return { output: 'Im background' }
})

// on extension activated or loaded
chrome.runtime.onInstalled.addListener(() => {
  for (const [type, action] of Object.entries(actions)) {
    if (!action.isContextMenu) continue
    chrome.contextMenus.create({
      id: type,
      title: action.title,
      documentUrlPatterns: action.urlPatterns,
    })
  }
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  await dispatchAction({ type: info.menuItemId, tabId: tab?.id })
})
