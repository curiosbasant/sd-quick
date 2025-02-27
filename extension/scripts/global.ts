import { setFavicon, setFormElementValue } from '../utils'

const formElements = document.querySelector<HTMLFormElement>('#form1')?.elements

if (formElements) {
  setFormElementValue<HTMLSelectElement>(
    formElements,
    'ctl00$ContentPlaceHolder1$ddlSession',
    (select) => {
      const lastOption = select.children[select.childElementCount - 1]
      return 'value' in lastOption ? (lastOption.value as string) : ''
    }
  )
  setFormElementValue(formElements, 'ContentPlaceHolder1_ddlSection', '1') // A
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlSection', '1') // A
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlstream', '3') // Arts
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlsubject', '0') // All
}

// Set Favicon
setFavicon('/SD1/Home/Public2/assets/img/home-icon.png')

// Set the window title
document.title = (() => {
  const title =
    // Get the title from the active breadcrumb or from the page title
    document.querySelector('ol.breadcrumb li.active, .box_heading h2')?.textContent?.trim() ??
    // Get the last pathname segment
    location.pathname.split('/').at(-1)?.slice(0, -5)

  return title ? `${title} | ShalaDarpan` : 'ShalaDarpan'
})()
