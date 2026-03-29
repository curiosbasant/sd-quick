import type { ContentScriptDefinition } from 'wxt'

import { createButton, makeSdRequest, sleep } from '~/utils'

export default {
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/SKBK_Student_SAReportCard_Final_*.aspx'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      // The students tables
      anchor: '#ContentPlaceHolder1_grdStudent_1 tr:nth-child(2)',
      onMount: () => {
        const downloadButton = createButton({
          className: 'btn btn-primary',
          onClick: handlePrintingAllResults,
        })
        downloadButton.setAttribute('style', 'border-color:transparent;outline:none')
        downloadButton.innerHTML =
          '<div><img src="Content/images/Print.png" title="Print"> Download All Results</div>'
        document
          .querySelector('.row.form-group:has(#ContentPlaceHolder1_grdStudent_1)')
          ?.insertAdjacentElement('beforebegin', downloadButton)
        return downloadButton
      },
      onRemove(printButton) {
        printButton?.removeEventListener('click', handlePrintingAllResults)
        printButton?.remove()
      },
    })

    // Call mount to add the UI to the DOM
    ui.autoMount()
  },
} satisfies ContentScriptDefinition

async function handlePrintingAllResults() {
  const printResultButtons = document.querySelectorAll<HTMLElement>(
    '[id^=ContentPlaceHolder1_grdStudent_1_btnDownload_]',
  )
  if (!printResultButtons.length) {
    alert('Results are not available for this class!')
    return
  }

  let popup
  for (const element of printResultButtons) {
    await makeSdRequest(element)
    popup = window.open(
      'SKBKStudentReportCardSA_New_Final_2026.aspx',
      'cba-result',
      'left=2,top=0,toolbar=0,scrollbars=1,status=1,width=1000,height=900',
    )
    await sleep(750)
  }
  popup?.close()
}
