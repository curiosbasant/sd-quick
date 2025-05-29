export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/SchoolStudentProfiles_New.aspx'],
  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: '#ContentPlaceHolder1_grdStudentProfile:has(tr:nth-child(4))',
      onMount() {
        const rightContainer =
          document.querySelector('.box_heading h2')?.parentElement?.nextElementSibling
        if (!rightContainer) return
        rightContainer.classList.add('tw:flex', 'tw:justify-end', 'tw:gap-4')

        const downloadCsvButton = createButton({
          className:
            'btn btn-default btn-xs tw:border-transparent tw:outline-none tw:text-4xl tw:opacity-90 tw:-mb-1 fa fa-download',
          title: 'Download CSV',
          onClick: () => {
            const rows = document.querySelectorAll<HTMLTableRowElement>(
              '#ContentPlaceHolder1_grdStudentProfile tr'
            )
            const csvContent = [...rows]
              .map((tr) => [...tr.children].map((td) => td.textContent?.trim()).join(','))
              .join('\n')

            downloadFile(csvContent, 'students-profile.csv')
          },
          signal: ctx.signal,
        })

        const printButton = createButton({
          className: 'btn btn-default btn-xs tw:border-transparent tw:outline-none',
          title: 'Print',
          onClick: handlePrint,
          signal: ctx.signal,
        })
        printButton.innerHTML = '<img src="Content/images/Print.png" >'
        rightContainer.replaceChildren(downloadCsvButton, printButton)
        return rightContainer
      },
      onRemove(rightContainer) {
        rightContainer?.replaceChildren()
      },
    })

    ui.autoMount()
  },
})

function handlePrint(ev: MouseEvent) {
  const content = document.querySelector('#dvReport')?.cloneNode(true) as HTMLDivElement
  if (!content) return

  // Add a space so to better wrap in a new line
  content.querySelector('#ContentPlaceHolder1_grdStudentProfile th')?.replaceChildren('Sr. No.')

  // remove unnecessary elements
  const spares = content.querySelector('#ContentPlaceHolder1_Div1')
  if (spares) {
    spares.previousElementSibling?.remove()
    spares.previousElementSibling?.remove()
    spares.nextElementSibling?.remove()
    spares.remove()
  }

  content.appendChild(document.createElement('style')).textContent = `
    #ContentPlaceHolder1_head, #div_Class_Section {
      display: block;
      width: 100%;
    }
    #ContentPlaceHolder1_today_Date {
      float: right;
      font-size: 8pt;
      font-weight: bold;
    }
    .box-title {
      text-align: center;
      width: 100%;
    }
    table {
      border: 1px;
      border-collapse: collapse;
      width: 100%;
      font-size: 10pt;
      padding: 0;
      border-spacing: 0;
    }
    table th, table td {
      border: 1px solid #000;
      padding: 8px;
    }
  `

  // remove high specificity styling
  content
    .querySelectorAll(
      '#ContentPlaceHolder1_head, #ContentPlaceHolder1_head .row .col, #tbl_class_section, #div_Class_Section, #ContentPlaceHolder1_today_Date, #ContentPlaceHolder1_grdStudentProfile'
    )
    .forEach((el) => el.removeAttribute('style'))
  // remove unnecessary elements
  content.querySelectorAll('#btn_lockComfirmation, .noprintData').forEach((el) => el.remove())

  // Copy session, class, section
  const fromTo = (from: string, to: string) => {
    const text = document.querySelector<HTMLSelectElement>(from)?.selectedOptions[0]?.textContent
    content.querySelector(to)?.replaceChildren(text ?? '')
  }
  fromTo('#ddlSession', '#spn_Session')
  fromTo('#ContentPlaceHolder1_ddlClass', '#spn_Class')
  fromTo('#ContentPlaceHolder1_ddlSection', '#spn_Section')

  const printPopup = window.open(
    '',
    '',
    'left=100,top=50,width=750,height=1000,toolbar=0,scrollbars=0,status=0'
  )
  if (printPopup) {
    printPopup.document.write(content.innerHTML)
    printPopup.document.close()
    printPopup.focus()
    printPopup.print()
    // avoid closing the popup, if pressed Shift key
    ev.shiftKey || printPopup.close()
  }
}
