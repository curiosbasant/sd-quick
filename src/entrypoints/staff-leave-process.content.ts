import { observeElementPresence, observeShiftKey } from '~/utils/browser'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/Staff_LeaveApproval.aspx'],
  main(ctx) {
    const signalObj = { signal: ctx.signal }
    const handleLeaveStatusChange = (ev: Event) => {
      const statusSelect = ev.currentTarget as HTMLSelectElement
      const checkbox = statusSelect.parentElement?.parentElement?.firstElementChild
        ?.firstElementChild as HTMLInputElement
      // ☑️ check checkbox on status change
      if (checkbox?.checked === (statusSelect.value === '99')) {
        checkbox.click()
      }
    }

    observeElementPresence<HTMLTableElement>({
      selector: '#ContentPlaceHolder1_grdLeaveDetails',
      target: '#ContentPlaceHolder1_UpdatePanel1',
      signal: ctx.signal,
      onPresenceChange(table) {
        if (!table) return
        // We will handle the first select input differently
        const [firstSelect, ...restSelects] = table.querySelectorAll<HTMLSelectElement>(
          'tr:nth-child(n+2) select'
        )

        for (const statusSelect of restSelects) {
          statusSelect.dataset.shiftTarget = ''
          statusSelect.addEventListener('input', handleLeaveStatusChange, signalObj)
        }

        // This is to handle the css styling by focusing/highlighting all the inputs
        const shiftKey = observeShiftKey({
          onPress(pressed) {
            if (pressed) {
              firstSelect.dataset.shiftTrigger = ''
            } else {
              delete firstSelect.dataset.shiftTrigger
            }
          },
          signal: ctx.signal,
        })
        const handleFirstLeaveStatusChange = (ev: Event) => {
          // Handle first input normally if shift is not pressed
          if (!shiftKey.pressed) return handleLeaveStatusChange(ev)

          // Click check-all checkbox
          const checkAllCheckbox = table.querySelector<HTMLInputElement>(
            '#ContentPlaceHolder1_grdLeaveDetails_chkAll'
          )!
          checkAllCheckbox.checked = false // so it can be checked again
          checkAllCheckbox.click()
          // Set the same value for all the inputs as in the first input
          for (const statusSelect of restSelects) {
            statusSelect.value = (ev.currentTarget as HTMLSelectElement).value
          }
        }

        firstSelect.addEventListener('input', handleFirstLeaveStatusChange, signalObj)
      },
    })
  },
})
