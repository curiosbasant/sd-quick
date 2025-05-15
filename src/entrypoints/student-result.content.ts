import { printContent } from '~/utils/browser'
import { makeSdRequest } from '~/utils/request'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/AllStudentResult.aspx'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      // The students tables
      anchor: '#ContentPlaceHolder1_grd_Student tr:nth-child(2)',
      onMount: () => {
        const printButton = document.createElement('button')
        printButton.classList.add('btn', 'btn-primary')
        printButton.setAttribute('style', 'border-color:transparent;outline:none')
        printButton.type = 'button'
        printButton.innerHTML =
          '<div><img src="Content/images/Print.png" title="Print"> Print All Results</div>'
        printButton.addEventListener('click', handlePrintingAllResults)
        document.getElementById('ContentPlaceHolder1_divlist')?.prepend(printButton)
        return printButton
      },
      onRemove: (printButton) => {
        printButton?.removeEventListener('click', handlePrintingAllResults)
        printButton?.remove()
      },
    })

    // Call mount to add the UI to the DOM
    ui.autoMount()
  },
})

async function handlePrintingAllResults() {
  const formNames = getVerifiedStudentFormNames()
  if (!formNames.length) return

  const promises = await Promise.allSettled(formNames.slice(0, 10).map(getResultFor))
  const contents: (Node | string)[] = []
  for (const p of promises) {
    if (p.status === 'fulfilled') {
      contents.push(p.value)
    }
  }
  printContent(...contents)
}

function getVerifiedStudentFormNames() {
  const trs = document.querySelectorAll('#ContentPlaceHolder1_grd_Student > tbody > tr:has(input)')
  const formNames: string[] = []
  for (const tr of trs) {
    // Pick only verified students
    if (tr.children[7]?.textContent?.trim() !== 'Verified') continue
    const btn = tr.querySelector<HTMLInputElement>('input[type=submit]')
    if (!btn) continue
    formNames.push(btn.name)
  }
  return formNames
}

async function getResultFor(studentPrintButtonName: string) {
  const a = await makeSdRequest(location.href, {
    [studentPrintButtonName]: 'Print Result',
  })
  // This is the printable content
  const div = a.querySelector<HTMLDivElement>('#div_print6_10')
  if (!div) return '<p>Session Out</p>'

  div.removeAttribute('id') // not necessary
  div.style.breakAfter = 'page' // to force break print page
  div.style.position = 'relative' // for rotated "Shaladarpan" text on middle of every page

  // These all styles are picked from shaladarpan itself
  div.querySelectorAll('table').forEach((el) => {
    el.style.cssText =
      'border-collapse:collapse;width:100%;height:100%;padding:6px;margin-bottom:10px;background-color:transparent;'
    el.setAttribute('border', '1')
    el.setAttribute('cellspacing', '0')
    el.setAttribute('cellpadding', '3')
  })

  div.querySelectorAll('h3').forEach((el) => {
    el.style.cssText = 'font-size:22px;background-color:transparent;margin:0;'
  })

  div.querySelectorAll('h4').forEach((el) => {
    el.style.cssText = 'margin:0;font-size:16px;text-align:center;background-color:transparent;'
  })

  div.querySelectorAll('h5').forEach((el) => {
    el.style.cssText =
      'font-weight:bold;font-size:18px;margin:0;background-color:transparent;text-transform:uppercase;text-align:left;'
  })

  div.querySelectorAll<HTMLDivElement>('.headerTable').forEach((el) => {
    el.style.cssText = 'display:table;width:100%;text-align:center;padding:10px;'
  })

  div.querySelectorAll<HTMLDivElement>('.bgTxt').forEach((el) => {
    el.style.cssText =
      'border:2px solid #000000;display:inline;padding:3px 15px;border-radius:10px;color:#000000;margin-bottom:15px;text-transform:uppercase;'
  })

  div.querySelectorAll<HTMLDivElement>('.govLogo, .topText, .resultLogo').forEach((el) => {
    el.style.cssText = 'display:table-cell;vertical-align:top;padding:10px;'
  })

  div.querySelectorAll<HTMLDivElement>('.m-0').forEach((el) => {
    el.style.cssText = 'margin:0;'
  })

  div.querySelectorAll<HTMLDivElement>('.bottomTable').forEach((el) => {
    el.style.cssText = 'margin-bottom:15px;height:100px;vertical-align:top;'
  })

  div.querySelectorAll<HTMLDivElement>('.r-table').forEach((el) => {
    el.style.cssText = 'margin-bottom:22px;border-bottom:2px solid #000000;'
  })

  div.querySelectorAll<HTMLDivElement>('.instructions').forEach((el) => {
    el.style.cssText =
      'font-size:11px;margin:0;padding:0;line-height:14px;margin-top:10px;width:100%;height:auto;overflow:auto;list-style:circle;'
  })

  div.querySelectorAll<HTMLDivElement>('.border-dark').forEach((el) => {
    el.style.cssText = 'border-bottom:2px solid #000000;'
  })

  div.querySelectorAll<HTMLDivElement>('.textRotate').forEach((el) => {
    el.style.cssText =
      'position:absolute;opacity:0.2;font-size:5em;width:100%;z-index:1000;margin-top:35%;margin-left:15%;margin-right:10%;'
    el.style.transform = 'rotate(320deg)'
  })
  return div
}
