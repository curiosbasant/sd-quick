import { getTableDomContents, resolveDocument } from '../src/utils'

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

export function setFormElementValue<T extends HTMLInputElement | HTMLSelectElement | RadioNodeList>(
  elements: HTMLFormControlsCollection,
  name: string | string[],
  value: string | ((elem: T) => string)
) {
  const resolveValue = (name: string) => {
    const elem = elements.namedItem(name) as T | null
    elem && (elem.value = typeof value === 'function' ? value(elem) : value)
  }

  typeof name === 'string' ? resolveValue(name) : name.forEach(resolveValue)
}

export function repeatUntil(cb: (done: () => void) => unknown, interval = 5e3) {
  const intervalId = setInterval(cb, interval, () => clearInterval(intervalId))
}

export function randomBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function setFavicon(url: string) {
  const favicon =
    document.querySelector<HTMLLinkElement>('#favicon') ??
    (() => {
      const link = document.createElement('link')
      link.id = 'favicon'
      link.rel = 'shortcut icon'
      link.type = 'image/png'
      return document.head.appendChild(link)
    })()

  favicon.href = url
  return favicon
}

export const actions = {
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
  }).then(resolveDocument)

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

function stringToHTML(text: string) {
  return [...new DOMParser().parseFromString(text, 'text/html').body.children]
}

export function makeSdRequest(url = location.href) {
  const fd = new FormData(document.querySelector<HTMLFormElement>('#form1') ?? undefined)

  return fetch(url, {
    method: 'POST',
    body: new URLSearchParams(fd as unknown as string),
  })
}

// chrome.scripting.executeScript({
//   target: { tabId: 0 },
//   files: ['dist/scripts/index.js'],
// })

/*
<div class="form-group required">
  <span id="ContentPlaceHolder1_Label6" class="control-label col-md-5">Student Admission Date</span> &nbsp;(Editable)*
  <div class="col-md-7">
    <input name="ctl00$ContentPlaceHolder1$txt_AdmissionDate" type="text" value="19/07/2022" id="ContentPlaceHolder1_txt_AdmissionDate" class="form-control datepicker hasDatepicker">
    <span id="ContentPlaceHolder1_RequiredFieldValidator6" style="display:none;"></span>
  </div>
</div>

ctl00$ScriptManager1: ctl00$ContentPlaceHolder1$UpdatePanel4|ctl00$ContentPlaceHolder1$grdAttendence$ctl05$btn_EditAca
*/
