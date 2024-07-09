// @ts-check
chrome.runtime.onMessage.addListener(handleMessage)

/**
 * @param {{action: string; payload:any}} message
 */
function handleMessage(message) {
  console.log(message)
  if (message.action === 'tc-list') {
    filterTableByDate(new Date(message.payload.date))
  } else if (message.action === 'mark-all-present') {
    const selects = /** @type {NodeListOf<HTMLSelectElement>} */ (
      document.querySelectorAll('#ContentPlaceHolder1_grd_NMMSApplicationFilled select')
    )
    selects.forEach((s) => (s.value = '0'))
  }
}

/**
 * @param {Date} filterDate
 */
function filterTableByDate(filterDate) {
  const tbody = document.querySelector('#ContentPlaceHolder1_grdSummary tbody')
  if (!tbody) return
  const headerRow = /** @type {HTMLTableRowElement!} */ (tbody.firstElementChild)
  const lastClassTd = headerRow.cells.item(6)
  if (!lastClassTd) return
  lastClassTd.textContent = 'Last Class'

  const today = `${filterDate.getDate().toString().padStart(2, '0')}-${(filterDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${filterDate.getFullYear()}`

  if (headerRow.childElementCount > 9) {
    for (let i = 0; i < tbody.childElementCount; i++) {
      const row = /** @type {HTMLTableRowElement!} */ (tbody.children.item(i))
      const tcDate = row.cells.item(2)
      if (tcDate) {
        tcDate.style.display = 'none'
        const trimmedDate = tcDate.textContent?.trim()
        if (trimmedDate) {
          tcDate.textContent = trimmedDate
        }
      }
      row.lastElementChild?.remove()
      row.lastElementChild?.remove()
    }
    document
      .querySelector('#ContentPlaceHolder1_Panel1')
      ?.insertAdjacentHTML(
        'afterbegin',
        `<p style="font-size: 24px; text-align: center; padding: 4px; font-weight: 800;">TC List Dated: ${today}</p>`
      )
  } else {
    const p = document.querySelector('#ContentPlaceHolder1_Panel1')?.firstElementChild
    p && (p.textContent = `TC List Dated: ${today}`)
  }

  for (let i = 1, c = 0; i < tbody.childElementCount; i++) {
    const row = /** @type {HTMLTableRowElement!} */ (tbody.children.item(i))
    const tcDate = row.cells.item(2)?.textContent

    if (!today || tcDate === today) {
      row.style.removeProperty('display')
      row.firstElementChild && (row.firstElementChild.textContent = String(++c))
    } else {
      row.style.display = 'none'
    }
  }
}
window.filterTableByDate = filterTableByDate
