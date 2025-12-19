import { createButton, observeElementPresence } from '~/utils'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/Staff_DailyAttendanceEntry.aspx'],
  main(ctx) {
    const markAllPresentButton = createButton({
      className: 'btn btn-primary',
      children: 'Mark All Present',
      onClick: handleMarkAllPresent,
      signal: ctx.signal,
    })

    observeElementPresence({
      selector: '#ContentPlaceHolder1_grd_NMMSApplicationFilled',
      target: '#ContentPlaceHolder1_upPnl',
      signal: ctx.signal,
      onPresenceChange(table) {
        if (!table) return

        const container = document.getElementsByClassName('box_heading')[0]
        if (container) {
          container.className = 'box_heading tw:flex tw:justify-between tw:gap-6 tw:me-6'
          container.append(markAllPresentButton)
        }
      },
    })
  },
})

function handleMarkAllPresent() {
  document
    .querySelectorAll<HTMLSelectElement>('#ContentPlaceHolder1_grd_NMMSApplicationFilled select')
    .forEach((s) => (s.value = '0'))
}
