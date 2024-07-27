// @ts-check

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    documentUrlPatterns: ['https://rajshaladarpan.nic.in/*/Staff_DailyAttendanceEntry.aspx'],
    id: 'mark-all-present',
    title: 'Mark all present',
  })
})

chrome.contextMenus.onClicked.addListener(handleContextMenuClick)

/**
 * @param {chrome.contextMenus.OnClickData} info
 * @param {chrome.tabs.Tab|undefined} tab
 */
function handleContextMenuClick(info, tab) {
  menuItemHandlers[info.menuItemId](info, tab)
}

/**
 * @satisfies {Record<string, (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => void>}
 */
const menuItemHandlers = {
  async 'mark-all-present'(info) {
    const [tab] = await chrome.tabs.query({ active: true })
    if (tab.id) {
      await chrome.tabs.sendMessage(tab.id, { action: info.menuItemId })
    }
  },
}
