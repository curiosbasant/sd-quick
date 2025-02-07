async function getStudents(standard) {
  const body = new URLSearchParams({
    ctl00$ScriptManager1: 'ctl00$ContentPlaceHolder1$UpdPanel|ctl00$ContentPlaceHolder1$btnSearch',
    __EVENTTARGET: '',
    __EVENTARGUMENT: '',
    __LASTFOCUS: '',
    __VIEWSTATE: document.getElementById('__VIEWSTATE')?.value,
    __VIEWSTATEGENERATOR: document.getElementById('__VIEWSTATEGENERATOR')?.value,
    __EVENTVALIDATION: document.getElementById('__EVENTVALIDATION')?.value,
    ctl00$ddlworkas: '220180',
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

  const doc = await fetch(
    'https://rajshaladarpan.rajasthan.gov.in/SD1/Home/School/SchoolStudentProfiles_New.aspx',
    {
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
      referrer:
        'https://rajshaladarpan.rajasthan.gov.in/SD1/Home/School/SchoolStudentProfiles_New.aspx',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: body.toString(),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    }
  ).then(responseToDocument)
  // console.log(doc)

  const details = [
    ...doc.querySelectorAll('#ContentPlaceHolder1_grdStudentProfile > tbody > *'),
  ].map((tr) => {
    const [
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
    ] = [...tr.children].map((td) => td.textContent.trim())

    return {
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
    }
  })

  // remove header row
  details.shift()
  // remove last row if empty
  details.at(-1).serialNumber || details.pop()

  if (details.length === 0) {
    console.warn('No data found for class ', standard)
  }

  return details
}

// Utils
/**
 * @param {Response} res
 */
function responseToDocument(res) {
  return res.text().then(getDocumentFromText)
}
/**
 * @param {string} text
 */
function getDocumentFromText(text) {
  return new DOMParser().parseFromString(text, 'text/html')
}
