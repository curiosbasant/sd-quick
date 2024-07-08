import { Button } from '~/components/ui'
import { ViewProps } from './types'
import { Header } from '~/components/header'
import { dispatchAction } from '~/lib/utils'

export function TcListView(props: ViewProps<'tcList'>) {
  return (
    <section>
      <Header title='TC List' onGoBack={() => props.onViewSelect('initial')} />
      <form
        className='space-y-6 p-4'
        onSubmit={async (ev) => {
          ev.preventDefault()
          const fd = new FormData(ev.currentTarget)

          await dispatchAction('tc-list', {
            date: fd.get('date') as string,
            url: chrome.runtime.getURL('/'),
          })
        }}>
        <input
          className='w-full rounded-md border p-2 h-10'
          name='date'
          defaultValue={new Date().toISOString().split('T')[0]}
          type='date'
        />
        <div className='flex justify-end'>
          <Button className='w-32' type='submit'>
            Submit
          </Button>
        </div>
      </form>
    </section>
  )
}

function filterTableByDate(filterDate: string) {
  const tbody = document.querySelector('#ContentPlaceHolder1_grdSummary tbody')
  if (!tbody) return
  const lastClassTd = (tbody.firstElementChild as HTMLTableRowElement).cells.item(6)
  if (!lastClassTd) return
  lastClassTd.textContent = 'Last Class'

  const d = new Date(filterDate)
  const today = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${d.getFullYear()}`

  document
    .querySelector('#ContentPlaceHolder1_Panel1')
    ?.insertAdjacentHTML(
      'afterbegin',
      `<p style="font-size: 24px; text-align: center; padding: 4px; font-weight: 800;">TC List Dated: ${today}</p>`
    )

  const filteredRows = [tbody.firstElementChild as HTMLTableRowElement]
  for (let i = 1; i < tbody.childElementCount; i++) {
    const row = tbody.children.item(i) as HTMLTableRowElement
    const tcDate = row.cells.item(2)?.textContent?.trim()

    if (tcDate === today) {
      filteredRows.push(row)
    }
  }

  // Sort class wise
  filteredRows.sort(
    (a, b) => parseInt(a.cells.item(6)?.textContent!) - parseInt(b.cells.item(6)?.textContent!)
  )

  for (let i = 0; i < filteredRows.length; i++) {
    const row = filteredRows[i]
    i && row.firstElementChild && (row.firstElementChild.textContent = String(i))
    row.cells.item(2)?.remove()
    row.lastElementChild?.remove()
    row.lastElementChild?.remove()
  }

  tbody.replaceChildren(...filteredRows)
}
