import { scrapeTable } from '~/utils/browser'
import { formatOrdinal } from '~/utils/formatters'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/StudentAttendence.aspx'],
  main(ctx) {
    const container = document.querySelector(
      '#ContentPlaceHolder1_footer2_divpersonalinformation > div:nth-child(4) > div:nth-child(3)'
    )
    if (container) {
      const downloadBtn = createButton({
        className: 'btn btn-default',
        onClick: handleDownloading,
        children: 'Download CSV',
        signal: ctx.signal,
      })
      container.appendChild(downloadBtn)
      container.classList.add('tw:text-right')
    }
  },
})

async function handleDownloading() {
  const sessionElem = document.querySelector<HTMLSelectElement>(
    '#ContentPlaceHolder1_footer2_ddlsession'
  )
  const classElem = document.querySelector<HTMLSelectElement>(
    '#ContentPlaceHolder1_footer2_ddlclass'
  )
  const sectionElem = document.querySelector<HTMLSelectElement>(
    '#ContentPlaceHolder1_footer2_ddlsection'
  )
  const monthElem = document.querySelector<HTMLSelectElement>(
    '#ContentPlaceHolder1_footer2_ddlmonth'
  )
  if (!sessionElem?.value || !classElem?.value || !sectionElem || !monthElem)
    return alert('Select the required session and class first!')

  const data = await getData({
    session: sessionElem,
    class: classElem,
    section: sectionElem,
    month: monthElem,
  })
  downloadFile(
    data.map((row) => row.join(',')).join('\n'),
    `student_monthly_attendance_report-${sessionElem.value}_class_${formatOrdinal(
      +classElem.value
    )}.csv`
  )
}

function getData(selects: Record<'session' | 'class' | 'section' | 'month', HTMLSelectElement>) {
  const promises = []
  // Loop over and make request for all the possible combinations in parallel
  for (const sectionOption of selects.section.options) {
    if (!sectionOption.value) continue
    for (const monthValue of [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4]) {
      const params = {
        [selects.session.name]: selects.session.value,
        [selects.class.name]: selects.class.value,
        [selects.section.name]: sectionOption.value,
        [selects.month.name]: monthValue,
        ctl00$ContentPlaceHolder1$footer2$btnshow: 'उपस्थिति दर्ज़ करें',
      }
      const formatRows = (doc: Document) => ({
        session: selects.session.value,
        standard: selects.class.value,
        section: sectionOption.text,
        month: selects.month.options[monthValue - 1].text.slice(0, 3), // make month shorter
        rows: scrapeTable('#ContentPlaceHolder1_footer2_gvattendence', doc).slice(1), // remove header
      })
      promises.push(makeSdRequest(undefined, params).then(formatRows))
    }
  }

  return Promise.all(promises).then((yearAttendance) => {
    const result = [['Session', 'Class', 'Section', 'SR No', 'Name']]
    for (let mi = 0; mi < yearAttendance.length; mi++) {
      const { session, standard, section, month, rows } = yearAttendance[mi]
      result[0].push(`${month} (${rows[0][3]})`) // add month to header

      for (let index = 0; index < rows.length; index++) {
        const [, srNo, stName, , attendance] = rows[index]
        result[index + 1] ??= [session, standard, section, srNo, stName]
        result[index + 1].push(attendance)
      }
    }
    return result
  })
}
