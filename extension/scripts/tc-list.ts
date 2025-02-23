const panel = document.querySelector('.panel-body:has(#ContentPlaceHolder1_Button1)')
if (panel) {
  const row = panel.appendChild(document.createElement('div'))
  row.classList.add('row')
  row.innerHTML = `
    <style>
      .filter-row {
        display: none;
      }
      .box_content:has(#ContentPlaceHolder1_grdSummary) .filter-row {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        gap: 1rem;
      }
    </style>
    <div class="filter-row">
      <span class="control-label">Filter By Date</span>
      <input class="form-control" type="date">
      <button class="btn btn-primary btn-sm" type="button">Filter</button>
    </div>
  `

  row.querySelector('button')?.addEventListener('click', (ev) => {
    const button = ev.currentTarget as HTMLButtonElement
    const input = button.previousElementSibling as HTMLInputElement
    input && filterTableByDate(new Date(input.value))
  })
}

function filterTableByDate(filterDate: Date) {
  const tbody = document.querySelector<HTMLTableElement>('#ContentPlaceHolder1_grdSummary tbody')
  if (!tbody) return

  const headerRow = tbody.firstElementChild as HTMLTableRowElement
  const lastClassTd = headerRow?.cells.item(6)
  if (!lastClassTd) return
  lastClassTd.textContent = 'Last Class'

  const today = `${filterDate.getDate().toString().padStart(2, '0')}-${(filterDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${filterDate.getFullYear()}`

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
        `<p style="font-size: 24px; text-align: center; padding: 4px; font-weight: 800;">TC List Dated: ${today}</p>`
      )
  } else {
    const p = document.querySelector('#ContentPlaceHolder1_Panel1')?.firstElementChild
    p && (p.textContent = `TC List Dated: ${today}`)
  }

  for (let i = 1, c = 0; i < tbody.childElementCount; i++) {
    const row = tbody.children.item(i) as HTMLTableRowElement
    const tcDate = row?.cells.item(2)?.textContent

    if (!today || tcDate === today) {
      row.style.removeProperty('display')
      row.firstElementChild && (row.firstElementChild.textContent = String(++c))
    } else {
      row.style.display = 'none'
    }
  }
}
