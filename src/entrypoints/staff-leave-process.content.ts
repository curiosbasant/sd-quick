import { observeElementPresence } from '~/utils/browser'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/Staff_LeaveApproval.aspx'],
  main(ctx) {
    observeElementPresence<HTMLTableElement>({
      selector: '#ContentPlaceHolder1_grdLeaveDetails',
      target: '#ContentPlaceHolder1_UpdatePanel1',
      signal: ctx.signal,
      onPresenceChange(table) {
        if (!table) return

        const trs = table.querySelectorAll<HTMLTableRowElement>('tr:nth-child(n+2)')
        trs.forEach((tr) => {
          const checkbox = tr.children[0].firstElementChild as HTMLInputElement
          const statusInput = tr.children[8].firstElementChild as HTMLSelectElement
          const handleLeaveStatusChange = () => {
            // Trigger the checkbox, if status has changed
            if (checkbox.checked === (statusInput.value === '99')) {
              checkbox.click()
            }
          }
          statusInput.addEventListener('change', handleLeaveStatusChange, { signal: ctx.signal })
        })
      },
    })
  },
})
