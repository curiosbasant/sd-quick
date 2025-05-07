import { repeatUntil } from '~/utils'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/Staff_LeaveApproval.aspx'],
  main() {
    repeatUntil((done) => {
      const trs = document.querySelectorAll<HTMLTableRowElement>(
        '#ContentPlaceHolder1_grdLeaveDetails tr:has(td)'
      )
      if (!trs.length) return

      trs.forEach((tr) => {
        const checkbox = tr.children[0].firstElementChild as HTMLInputElement
        const select = tr.children[8].firstElementChild as HTMLSelectElement
        select.addEventListener('change', () => {
          // Trigger the checkbox, if status has changed
          if (checkbox.checked === (select.value === '99')) {
            checkbox.click()
          }
        })
      })
      done()
    })
  },
})
