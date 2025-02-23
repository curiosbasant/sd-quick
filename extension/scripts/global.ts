import { setFormElementValue } from '../utils'

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
