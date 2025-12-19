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
          title: 'Assign roll numbers in sequence for empty fields',
          children: 'Assign Rolls',
          onClick: () => handleAssigningRolls(getClass()),
          signal: ctx.signal,
        })
        con?.replaceChildren(generateButton)
      },
    })

    // Call mount to add the UI to the DOM
    ui.autoMount()
  },
} satisfies ContentScriptDefinition

function handleAssigningRolls(classValue: number) {
  const fields = document.querySelectorAll<HTMLInputElement>(
    '[id^=ContentPlaceHolder1_grdStudentRollGrid_RollNumberTextBox]',
  )
  let maxRoll = classValue * 100
  for (const field of fields) {
    const value = +field.value
    if (value > maxRoll) maxRoll = value
  }
  for (const field of fields) {
    if (field.value) continue
    field.value = String(++maxRoll)
  }
}

function getClass() {
  const classValue =
    document.querySelector<HTMLSelectElement>('#ContentPlaceHolder1_ddlClass')?.value
    || prompt('Enter Class')
  return classValue ? parseInt(classValue) : 0
}
