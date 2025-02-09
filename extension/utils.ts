export function onRuntimeMessage<T, R>(
  cb: (message: T, sender: chrome.runtime.MessageSender) => Promise<R>
) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender.url, chrome.runtime.getURL('index.html'))
    if (sender.url === chrome.runtime.getURL('index.html')) {
      console.log('The message is safe!', message)
    }

    cb(message, sender).then(sendResponse)
    return true
  })
}

export function getTableDomContents(tableRows: NodeListOf<HTMLTableRowElement>) {
  return [...tableRows].map((tr) => [...tr.children].map((td) => td.textContent?.trim()))
}

export function responseToDocument(res: Response) {
  if (!res.ok) throw new Error('Response not Okay')
  return res.text().then(parseHtmlString)
}

export function parseHtmlString(text: string) {
  return new DOMParser().parseFromString(text, 'text/html')
}

// chrome.scripting.executeScript({
//   target: { tabId: 0 },
//   files: ['dist/scripts/index.js'],
// })

export const actions = {
  'mark-all-present': {
    title: 'Mark all present',
    isContextMenu: true,
    urlPatterns: [
      'https://rajshaladarpan.rajasthan.gov.in/*/Staff_DailyAttendanceEntry.aspx',
      'https://*/*',
    ],
    handler() {
      console.log('Says hello')
      const selects = document.querySelectorAll<HTMLSelectElement>(
        '#ContentPlaceHolder1_grd_NMMSApplicationFilled select'
      )
      selects.forEach((s) => (s.value = '0'))
    },
  },
  'save-student-profile': {
    title: 'Save student profile',
    isContextMenu: false,
    urlPatterns: ['https://rajshaladarpan.rajasthan.gov.in/*/SchoolStudentProfiles_New.aspx'],
    async handler(payload: string[]) {
      const stds = payload.includes('all') ? Array.from(Array(12), (_, i) => i + 1) : payload
      return (await Promise.all(stds.map(getStudents))).flat()
    },
  },
}

async function getStudents(standard: number | string) {
  const body = new URLSearchParams({
    ctl00$ScriptManager1: 'ctl00$ContentPlaceHolder1$UpdPanel|ctl00$ContentPlaceHolder1$btnSearch',
    __EVENTTARGET: '',
    __EVENTARGUMENT: '',
    __LASTFOCUS: '',
    __VIEWSTATE: (document.getElementById('__VIEWSTATE') as HTMLInputElement)?.value,
    __VIEWSTATEGENERATOR: (document.getElementById('__VIEWSTATEGENERATOR') as HTMLInputElement)
      ?.value,
    __EVENTVALIDATION: (document.getElementById('__EVENTVALIDATION') as HTMLInputElement)?.value,
    ctl00$ddlworkas: (document.getElementById('ddlworkas') as HTMLInputElement).value,
    ctl00$ContentPlaceHolder1$ddlSession: '2024-25',
    ctl00$ContentPlaceHolder1$ddlClass: standard.toString(),
    ctl00$ContentPlaceHolder1$ddlSection: '1',
    ctl00$ContentPlaceHolder1$grdStudentProfile$ctl02$hdnStudentIsPromoted: '',
    ctl00$ContentPlaceHolder1$grdStudentProfile$ctl02$hdnAadharVerify: '',
    ctl00$ContentPlaceHolder1$grdStudentProfile$ctl02$hdnJanVerify1: '',
    ctl00$ContentPlaceHolder1$grdStudentProfile$ctl02$hdnJanVerify2: '',
    ctl00$ContentPlaceHolder1$txtprecentage: '',
    ctl00$ContentPlaceHolder1$txtDOB_Edit: '',
    ctl00$ContentPlaceHolder1$ddloldschoolresultstatus: '',
    ctl00$ContentPlaceHolder1$txt_AdmissionDate: '',
    ctl00$ContentPlaceHolder1$txtMaxAttendance: '',
    ctl00$ContentPlaceHolder1$txtMinAttendance: '',
    ctl00$ContentPlaceHolder1$txtFail: '',
    ctl00$ContentPlaceHolder1$txtResultDate: '',
    ctl00$ContentPlaceHolder1$HiddenField1: '',
    ctl00$ContentPlaceHolder1$hfTCID: '',
    __ASYNCPOST: 'true',
    ctl00$ContentPlaceHolder1$btnSearch: 'Show',
  })

  const doc = await fetch(location.href, {
    headers: {
      accept: '*/*',
      'accept-language': 'en-IN,en;q=0.9,hi;q=0.8',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-microsoftajax': 'Delta=true',
      'x-requested-with': 'XMLHttpRequest',
    },
    referrer: location.href,
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: body.toString(),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then(responseToDocument)

  const details = getTableDomContents(
    doc.querySelectorAll('#ContentPlaceHolder1_grdStudentProfile tr')
  ).map(
    ([
      serialNumber,
      ooscStatus,
      srNo,
      nicId,
      name,
      fName,
      mName,
      category,
      gender,
      dob,
      mobile,
    ]) => ({
      class: standard,
      serialNumber,
      ooscStatus,
      srNo,
      nicId,
      name,
      fName,
      mName,
      category,
      gender,
      dob,
      mobile,
    })
  )

  // remove header row
  details.shift()
  // remove last row if empty
  details.at(-1)?.serialNumber || details.pop()

  if (details.length === 0) {
    console.warn('No data found for class ', standard)
  }

  return details
}
