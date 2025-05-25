export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/Staff_DailyAttendanceEntry.aspx'],
  main() {
    const markAllPresentButton = createButton({
      className: 'btn btn-primary',
      children: 'Mark All Present',
      onClick: handleMarkAllPresent,
    })

    const styles = document.createElement('style')
    styles.appendChild(
      document.createTextNode(`
        .box_heading {
          display: flex;
          justify-content: space-between;
          margin-right: 1.5rem;
        }

        /* Hide the mark all present button when staff list is not present */
        .home_boxes:not(:has(#ContentPlaceHolder1_divStaffList)) .box_heading > button {
          display: none;
        }
      `)
    )

    document.getElementsByClassName('box_heading')[0]?.append(markAllPresentButton, styles)
  },
})

function handleMarkAllPresent() {
  document
    .querySelectorAll<HTMLSelectElement>('#ContentPlaceHolder1_grd_NMMSApplicationFilled select')
    .forEach((s) => (s.value = '0'))
}
