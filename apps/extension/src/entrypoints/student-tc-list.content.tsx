export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/SchoolTcReport.aspx'],
  main(ctx) {
    createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '#ContentPlaceHolder1_grdSummary tr:nth-child(2)',
      onMount: (wrapper) => {
        const panel = document.querySelector('.panel-body:has(#ContentPlaceHolder1_Button1)')
        if (!panel) return

        panel.appendChild(wrapper)
        wrapper.classList.add('row')
        wrapper.innerHTML = `
          <div class="tw:grid tw:grid-cols-3 tw:mt-8 tw:items-center tw:gap-4">
            <span class="control-label">Filter By Date</span>
            <input class="form-control" type="date">
            <button class="btn btn-primary btn-sm" type="button">Filter</button>
          </div>
        `
        ctx.addEventListener(wrapper.querySelector('button')!, 'click', (ev) => {
          const button = ev.currentTarget as HTMLButtonElement
          const input = button.previousElementSibling as HTMLInputElement
          input && filterTableByDate(new Date(input.value))
        })
      },
    }).autoMount()
  },
})

function filterTableByDate(filterDate: Date) {
  const tbody = document.querySelector<HTMLTableElement>('#ContentPlaceHolder1_grdSummary tbody')
  if (!tbody) return

  const headerRow = tbody.firstElementChild as HTMLTableRowElement
  const lastClassTd = headerRow?.cells.item(6)
  if (!lastClassTd) return
  lastClassTd.textContent = 'Last Class'

  const formattedDate = filterDate.toLocaleDateString().replace(/\//g, '-')

  if (headerRow.childElementCount > 9) {
    for (let i = 0; i < tbody.childElementCount; i++) {
      const row = tbody.children.item(i) as HTMLTableRowElement
      const tcDate = row?.cells.item(2)
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
        `<p class="tw:text-center tw:p-1 tw:font-bold tw:text-2xl">TC List Dated: ${formattedDate}</p>`,
      )
  } else {
    const p = document.querySelector('#ContentPlaceHolder1_Panel1')?.firstElementChild
    p && (p.textContent = `TC List Dated: ${formattedDate}`)
  }

  for (let i = 1, c = 0; i < tbody.childElementCount; i++) {
    const row = tbody.children.item(i) as HTMLTableRowElement
    const tcDate = row?.cells.item(2)?.textContent

    if (!formattedDate || tcDate === formattedDate) {
      row.style.removeProperty('display')
      row.firstElementChild && (row.firstElementChild.textContent = String(++c))
    } else {
      row.style.display = 'none'
    }
  }
}
