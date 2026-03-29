import type { ContentScriptDefinition } from 'wxt'

import { createButton } from '~/utils'
import { mountWithReact } from '~/utils/browser'

export default {
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/SchoolTcReport.aspx'],
  main(ctx) {
    createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '#ContentPlaceHolder1_grdSummary tr:nth-child(2)',
      append(_, wrapper) {
        document.querySelector('#dvReport')?.insertAdjacentElement('beforebegin', wrapper)
      },
      onMount: mountWithReact(
        <div className='tw:mt-8 tw:grid tw:grid-cols-4 tw:items-center tw:gap-4'>
          <span className='control-label'>Filter By Date</span>
          <DateRangePicker />
          <button
            className='btn btn-primary btn-sm'
            onClick={(ev) => {
              const button = ev.currentTarget as HTMLButtonElement
              const startDateInput = button.previousElementSibling
                ?.previousElementSibling as HTMLInputElement
              const endDateInput = button.previousElementSibling as HTMLInputElement
              startDateInput
                && filterTableByDateRange(getDatesInRange(startDateInput.value, endDateInput.value))
            }}
            type='button'>
            Filter
          </button>
        </div>,
      ),
      onRemove(root) {
        root?.unmount()
      },
    }).autoMount()
  },
} satisfies ContentScriptDefinition

function DateRangePicker() {
  const [dates, setDates] = useState<{ startDate: string; endDate: string } | null>(null)

  return (
    <>
      <input
        className='form-control'
        value={dates?.startDate ?? ''}
        // max={!dates?.endDate || dates.startDate === dates.endDate ? undefined : dates.endDate}
        onChange={(ev) => {
          const startInput = ev.currentTarget
          setDates((prev) => ({
            startDate: startInput.value,
            endDate:
              !prev?.endDate || startInput.valueAsDate! >= new Date(prev.endDate) ?
                startInput.value
              : prev.endDate,
          }))
        }}
        placeholder='Start Date'
        type='date'
      />
      <input
        className='form-control'
        value={dates?.endDate ?? ''}
        min={dates?.startDate ?? undefined}
        onChange={(ev) => {
          setDates((prev) => ({
            startDate: prev?.startDate ?? ev.target.value,
            endDate: ev.target.value,
          }))
        }}
        placeholder='End Date'
        type='date'
      />
    </>
  )
}

function filterTableByDateRange(dateRange: Date[]) {
  const tbody = document.querySelector<HTMLTableElement>('#ContentPlaceHolder1_grdSummary tbody')
  if (!tbody) return

  const headerRow = tbody.firstElementChild as HTMLTableRowElement
  const lastClassTd = headerRow?.cells[6]
  if (!lastClassTd) return
  lastClassTd.textContent = 'Last Class'

  const formattedDates = dateRange.map((d) => d.toLocaleDateString())

  document.querySelector<HTMLElement>('#ContentPlaceHolder1_head')?.style.removeProperty('display')
  const tblReport = document.querySelector<HTMLElement>('#tblreport1')
  if (tblReport) {
    tblReport.style.removeProperty('display')
    tblReport.removeAttribute('class')
    tblReport.firstElementChild?.removeAttribute('class')
  }
  document.querySelectorAll<HTMLElement>('.header').forEach((elem) => (elem.style.height = 'auto'))
  document.querySelector('#ContentPlaceHolder1_Panel1')?.parentElement?.removeAttribute('class')
  const titleElem = document.querySelector('#ContentPlaceHolder1_lblhdrtc')
  if (titleElem) {
    titleElem.textContent = `Student TC List (${formattedDates.length === 1 ? formattedDates[0] : `${formattedDates[0]} - ${formattedDates.at(-1)}`})`
  }

  for (let i = 0; i < tbody.childElementCount; i++) {
    const row = tbody.children[i]
    if (!row) continue
    const [
      serialNoCell,
      bookNoCell,
      tcDateCell,
      studentNameCell,
      srNoCell,
      sessionCell,
      lastClassCell,
      tcReasonCell,
      duplicateTcDateCell,
      workCell,
    ] = row.children

    bookNoCell.classList.add('tw:hidden')
    duplicateTcDateCell.classList.add('tw:hidden')
    workCell.classList.add('tw:hidden')

    row.replaceChildren(
      serialNoCell,
      bookNoCell,
      tcDateCell,
      sessionCell,
      lastClassCell,
      srNoCell,
      studentNameCell,
      tcReasonCell,
      duplicateTcDateCell,
      workCell,
    )
  }

  for (let i = 1, c = 0; i < tbody.childElementCount; i++) {
    const row = tbody.children[i] as HTMLTableRowElement
    const tcDate = row?.cells[2]?.textContent?.trim().replace(/\-/g, '/')
    console.log(tcDate, formattedDates.includes(tcDate))

    if (formattedDates.includes(tcDate)) {
      row.classList.remove('tw:hidden')
      // add numbering
      row.firstElementChild?.replaceChildren(String(++c))
    } else {
      row.classList.add('tw:hidden')
    }
  }

  const footer = document.querySelector('#ContentPlaceHolder1_footer')
  if (footer) {
    footer.removeAttribute('class')
    const resetButton = createButton({
      className: 'btn btn-primary',
      onClick: () => {
        if (titleElem) {
          titleElem.textContent = `Student TC List`
        }
        for (let i = 0; i < tbody.childElementCount; i++) {
          const row = tbody.children[i]
          row.classList.remove('tw:hidden')
          row.children[1].classList.remove('tw:hidden')
          row.children[row.childElementCount - 1].classList.remove('tw:hidden')
          row.children[row.childElementCount - 2].classList.remove('tw:hidden')
        }
      },
      children: 'Reset',
    })
    footer.replaceChildren(resetButton)
  }
}

function getDatesInRange(startDate: string, endDate?: string) {
  if (!endDate || startDate === endDate) return [new Date(startDate)]
  const dates = []

  let current = new Date(startDate)
  const last = new Date(endDate)
  if (current > last)
    throw new TypeError(`Start date (${startDate}) can't be greater than end date (${endDate})`)

  while (current <= last) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}
