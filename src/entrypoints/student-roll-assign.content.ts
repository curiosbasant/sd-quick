import { ContentScriptDefinition } from 'wxt'
import { createButton } from '~/utils'

export default {
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/RMSA_StudentRollNo.aspx'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '#ContentPlaceHolder1_grdStudentRollGrid',
      onMount: () => {
        const con = document.querySelector('#ContentPlaceHolder1_UpdateButtonID > div:nth-child(3)')

        const generateButton = createButton({
          className: 'btn btn-info',
          title: 'Assign all roll numbers in sequence based on class',
          children: 'Assign Rolls',
          onClick: () => {
            const std = getClass()
            document
              .querySelectorAll<HTMLInputElement>(
                '[id^=ContentPlaceHolder1_grdStudentRollGrid_RollNumberTextBox]',
              )
              .forEach((inp, i) => (inp.value = std * 100 + i + 1 + ''))
          },
          signal: ctx.signal,
        })
        con?.replaceChildren(generateButton)
      },
    })

    // Call mount to add the UI to the DOM
    ui.autoMount()
  },
} satisfies ContentScriptDefinition

function getClass() {
  const classValue =
    document.querySelector<HTMLSelectElement>('#ContentPlaceHolder1_ddlClass')?.value
    || prompt('Enter Class')
  return classValue ? parseInt(classValue) : 0
}
