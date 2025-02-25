import { repeatUntil } from '../utils'

repeatUntil((done) => {
  const elem = document.querySelector('.table-responsive')
  if (!elem?.childElementCount) return

  // Fix tabbing, by setting input tabIndex to table cell's index
  document.querySelectorAll<HTMLInputElement>('table tr td > input[type="text"]').forEach((inp) => {
    inp.type = 'number'
    inp.tabIndex = (inp.parentElement as HTMLTableCellElement).cellIndex
  })
  done()
})
