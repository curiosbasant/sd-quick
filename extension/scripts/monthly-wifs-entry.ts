import { randomBetween } from '../utils'

document.querySelector('#ContentPlaceHolder1_Button1')?.setAttribute('class', 'btn btn-primary')
document.querySelector('#ContentPlaceHolder1_btnSubmit')?.setAttribute('class', 'btn btn-success')
document.querySelector('#ContentPlaceHolder1_Lock')?.setAttribute('class', 'btn btn-danger')

const fillRandomButton = document
  .querySelector('#ContentPlaceHolder1_btnSubmit')
  ?.parentElement?.previousElementSibling?.appendChild(document.createElement('button'))
if (fillRandomButton) {
  fillRandomButton.type = 'button'
  fillRandomButton.classList.add('btn', 'btn-info')
  fillRandomButton.textContent = 'Fill Random'
  fillRandomButton.addEventListener('click', () => {
    document.querySelectorAll('.table.gridview tr:has(input)').forEach((tr) => {
      const randomFill = (start: number) => {
        const max = +(tr.children[start]?.firstElementChild as HTMLInputElement)?.value

        const moreConsumption = randomBetween(Math.max(0, max - 3), max)
        const lessConsumption = max - moreConsumption

        ;(tr.children[start + 3].firstElementChild as HTMLInputElement).value =
          String(moreConsumption)
        ;(tr.children[start + 5].firstElementChild as HTMLInputElement).value =
          String(lessConsumption)
      }
      randomFill(1) // Boys
      randomFill(2) // Girls
      ;(tr.children[21].lastElementChild as HTMLSelectElement).value = '1'
      ;(tr.children[22].lastElementChild as HTMLSelectElement).value = '1'
    })
  })
}
