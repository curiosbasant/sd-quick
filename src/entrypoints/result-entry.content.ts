import { randomBetween, repeatUntil } from '~/utils'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/StudentAccess_MarksEnter_School.aspx'],
  main() {
    repeatUntil((done) => {
      const elem = document.querySelector('.table-responsive')
      if (!elem?.childElementCount) return

      // Fix tabbing, by setting input tabIndex to table cell's index
      document
        .querySelectorAll<HTMLInputElement>('table tr td > input[type="text"]')
        .forEach((inp) => {
          inp.type = 'number'
          inp.tabIndex = (inp.parentElement as HTMLTableCellElement).cellIndex
        })

      // Add inputs to header for random marks generation
      document
        .querySelectorAll<HTMLTableCellElement>(
          [
            ...document.querySelectorAll<HTMLTableCellElement>(
              'table tr:nth-child(2) td:has(input[type="number"])'
            ),
          ]
            .map((td) => `table tr:first-child th:nth-child(${td.cellIndex + 1})`)
            .join(',')
        )
        .forEach((th) => {
          const handleGeneration = (min: number, max: number) => {
            document
              .querySelectorAll<HTMLInputElement>(
                `.home_boxes tr td:nth-child(${th.cellIndex + 1}) > input`
              )
              .forEach((inp) => (inp.value = randomBetween(min, max).toString()))
          }
          th.appendChild(generateInputs(handleGeneration))
        })

      done()
    })
  },
})

function generateInputs(cb: (min: number, max: number) => void) {
  const div = document.createElement('div')
  div.style.display = 'grid'
  div.style.gridTemplateColumns = '1fr 1fr'
  div.style.gap = '0.25rem'

  const inp1 = document.createElement('input')
  inp1.type = 'number'
  inp1.placeholder = 'Min'
  inp1.style.minWidth = '8ch'

  const inp2 = document.createElement('input')
  inp2.type = 'number'
  inp2.placeholder = 'Max'
  inp2.style.minWidth = '8ch'

  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = 'Generate'
  button.classList.add('btn', 'btn-primary', 'btn-sm')
  button.style.gridColumn = '1 / -1'
  button.addEventListener('click', () => cb(+inp1.value, +inp2.value))

  div.append(inp1, inp2, button)
  return div
}
