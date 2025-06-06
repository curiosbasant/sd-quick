export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/RoleChange.aspx'],
  main() {
    // Click popup dismiss button
    document.querySelector<HTMLButtonElement>('#divPopup button[data-dismiss]')?.click()

    const contentContainer =
      document.querySelector<HTMLButtonElement>('#divPopup')?.previousElementSibling
    if (contentContainer) {
      const popMessage = document.querySelector('#popMsg')?.textContent?.trim()
      contentContainer.className =
        'tw:flex tw:items-center tw:justify-center tw:w-full tw:text-center tw:text-4xl tw:font-bold'
      contentContainer.textContent = popMessage || 'Role Changed!'
    }
  },
})
