import { createRoot } from 'react-dom/client'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/SchoolTcReport.aspx'],
  main(ctx) {
    createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '#ContentPlaceHolder1_grdSummary tr:nth-child(2)',
      append(_, wrapper) {
        document.querySelector('#dvReport')?.insertAdjacentElement('beforebegin', wrapper)
      },
      onMount(wrapper) {
        const root = createRoot(wrapper)
        root.render(
          <div className='tw:mt-8 tw:grid tw:grid-cols-4 tw:items-center tw:gap-4'>
            <span className='control-label'>Filter By Date</span>
            <DateRangePicker />
            <button
              className='btn btn-primary btn-sm'
              onClick={(ev) => {
                const button = ev.currentTarget as HTMLButtonElement
                const endDateInput = button.previousElementSibling as HTMLInputElement
                endDateInput && filterTableByDate(new Date(endDateInput.value))
              }}
              type='button'>
              Filter
            </button>
          </div>,
        )
        return root
      },
      onRemove(root) {
        root?.unmount()
      },
    }).autoMount()
  },
})

function DateRangePicker() {
  const [startDate, setStartDate] = useState<string | null>(null)
  // const [endDate, setEndDate] = useState<string | null>(null)

  return (
    <>
      <input
        className='form-control'
        onChange={(ev) => setStartDate(ev.target.value)}
        placeholder='Start Date'
        type='date'
      />
      <input
        className='form-control'
        min={startDate ?? undefined}
        placeholder='End Date'
        type='date'
      />
    </>
  )
}

function filterTableByDate(filterDate: Date) {
  const tbody = document.querySelector<HTMLTableElement>('#ContentPlaceHolder1_grdSummary tbody')
  if (!tbody) return

  const headerRow = tbody.firstElementChild as HTMLTableRowElement
  const lastClassTd = headerRow?.cells[6]
  if (!lastClassTd) return
  lastClassTd.textContent = 'Last Class'

  const formattedDate = filterDate.toLocaleDateString().replace(/\//g, '-')

  if (headerRow.childElementCount > 9) {
    document
      .querySelectorAll<HTMLElement>('#ContentPlaceHolder1_head, #tblreport1')
      .forEach((elem) => elem.style.removeProperty('display'))
    document
      .querySelectorAll<HTMLElement>('.header')
      .forEach((elem) => (elem.style.height = 'auto'))

    for (let i = 0; i < tbody.childElementCount; i++) {
      const row = tbody.children[i] as HTMLTableRowElement
      if (!row) continue
      const bookNoCell = row.cells[1]
      if (bookNoCell) {
        bookNoCell.classList.add('tw:hidden')
        bookNoCell.after(row.cells[4], row.cells[6], row.cells[5]) // move srno, last class, last session
      }

      row.lastElementChild?.remove() // remove action button cell
      row.lastElementChild?.remove() // remove duplicate tc date cell
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
    const row = tbody.children[i] as HTMLTableRowElement
    const tcDate = row?.cells[2]?.textContent?.trim()

    if (!formattedDate || tcDate === formattedDate) {
      row.classList.remove('tw:hidden')
      // add numbering
      row.firstElementChild?.replaceChildren(String(++c))
    } else {
      row.classList.add('tw:hidden')
    }
  }
}
