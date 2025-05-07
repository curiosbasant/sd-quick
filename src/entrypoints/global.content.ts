import { setFavicon, setFormElementValue } from '~/utils'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*'],
  main() {
    setGlobalDefaults()
    setFavicon('/SD1/Home/Public2/assets/img/home-icon.png')

    // Set the window title
    document.title = (() => {
      const title =
        // Get the title from the active breadcrumb or from the page title
        document.querySelector('ol.breadcrumb li.active, .box_heading h2')?.textContent?.trim() ??
        // Get the last pathname segment from url
        location.pathname.split('/').at(-1)?.slice(0, -5)

      return title ? `${title} | ShalaDarpan` : 'ShalaDarpan'
    })()

    // Force dropdown menu links in single line, so it don't push others
    document.querySelectorAll<HTMLAnchorElement>('#ulmenu1 .padd').forEach((a) => {
      a.style.display = '-webkit-box'
      a.style.webkitBoxOrient = 'vertical'
      a.style.webkitLineClamp = '1'
      a.style.overflow = 'hidden'
      a.style.padding = '3px 0 3px 20px'

      a.textContent && (a.title = a.textContent.trim())
    })
  },
})

function setGlobalDefaults() {
  const formElements = document.querySelector<HTMLFormElement>('#form1')?.elements
  if (!formElements) return

  setFormElementValue<HTMLSelectElement>(
    formElements,
    [
      'ctl00$ContentPlaceHolder1$ddlSession',
      'ctl00$ContentPlaceHolder1$ctl00$ddlSession', // RMSA_MonthlySessionsEntry
      'ctl00$ContentPlaceHolder1$footer2$ddlsession', // StudentAttendence
    ],
    (select) => {
      const lastOption = select.lastElementChild
      return lastOption && 'value' in lastOption ? (lastOption.value as string) : ''
    }
  )
  setFormElementValue(
    formElements,
    [
      'ContentPlaceHolder1_ddlSection',
      'ctl00$ContentPlaceHolder1$ddlSection',
      'ctl00$ContentPlaceHolder1$footer2$ddlsection', // StudentAttendence
    ],
    '1' // A
  )
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlstream', '3') // Arts
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlsubject', '0') // All
}
