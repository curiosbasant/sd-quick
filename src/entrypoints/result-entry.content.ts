import { observeElementPresence } from '~/utils/browser'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/StudentAccess_MarksEnter_School.aspx'],
  main(ctx) {
    observeElementPresence<HTMLTableElement>({
      target: '#ContentPlaceHolder1_up_pnl',
      // making sure table has at-least 2 rows
      selector: 'table:has(tr:nth-child(2))',
      signal: ctx.signal,
      onPresenceChange(table) {
        if (!table) return

        // Make the tabbing go vertically not horizontally
        table.querySelectorAll<HTMLInputElement>('tr td > input[type="text"]').forEach((inp) => {
          inp.type = 'number'
          inp.tabIndex = (inp.parentElement as HTMLTableCellElement).cellIndex
        })

        // Add inputs to header for random marks generation
        table
          .querySelectorAll<HTMLTableCellElement>(
            // Get headers that has input fields
            [
              ...table.querySelectorAll<HTMLTableCellElement>(
                'tr:nth-child(2) td:has(input[type="number"])'
              ), // select all inputs from 2nd row
            ]
              .map((td) => `tr:first-child th:nth-child(${td.cellIndex + 1})`)
              .join(',')
          )
          .forEach((th) => {
            const handleGeneration = (min: number, max: number) => {
              table
                .querySelectorAll<HTMLInputElement>(
                  `.home_boxes tr td:nth-child(${th.cellIndex + 1}) > input`
                )
                .forEach((inp) => (inp.value = randomBetween(min, max).toString()))
            }
            th.appendChild(generateInputs(handleGeneration))
          })
      },
    })
  },
})

function generateInputs(cb: (min: number, max: number) => void) {
  const div = document.createElement('div')
  div.className = 'tw:grid tw:grid-cols-2 tw:gap-2 tw:mt-2'

  const inp1 = document.createElement('input')
  inp1.type = 'number'
  inp1.placeholder = 'Min'
  inp1.className = 'tw:min-w-[8ch] tw:border tw:px-2 tw:py-1 tw:rounded-xs'

  const inp2 = document.createElement('input')
  inp2.type = 'number'
  inp2.placeholder = 'Max'
  inp2.className = 'tw:min-w-[8ch] tw:border tw:px-2 tw:py-1 tw:rounded-xs'

  const button = createButton({
    className: 'btn btn-primary btn-sm tw:col-span-full',
    children: 'Generate',
    onClick: () => cb(+inp1.value, +inp2.value),
  })

  div.append(inp1, inp2, button)
  return div
}
