import { createButton } from '~/utils/elements'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/RMSA_SChoolMonthly_NP_tablets.aspx'],
  main() {
    document.querySelector('#ContentPlaceHolder1_Button1')?.setAttribute('class', 'btn btn-primary')
    document
      .querySelector('#ContentPlaceHolder1_btnSubmit')
      ?.setAttribute('class', 'btn btn-success')
    document.querySelector('#ContentPlaceHolder1_Lock')?.setAttribute('class', 'btn btn-danger')

    const container = document.querySelector('#ContentPlaceHolder1_btnSubmit')?.parentElement
      ?.previousElementSibling
    if (!container) return

    const fillRandomButton = createButton({
      className: 'btn btn-info',
      children: 'Fill Random',
      onClick: handleAutoFill,
    })
    container.appendChild(fillRandomButton)
  },
})

function handleAutoFill() {
  document.querySelectorAll('.table.gridview tr:has(input)').forEach((tr) => {
    const randomFill = (start: number) => {
      const studentCount = +(tr.children[start]?.firstElementChild as HTMLInputElement)?.value
      const moreConsumption = randomBetween(Math.max(0, studentCount - 3), studentCount)
      const lessConsumption = studentCount - moreConsumption
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
}
