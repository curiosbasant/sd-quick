export {}
declare global {
  interface Window {
    __pen_sd_data?: Map<
      string,
      Record<
        | 'srn'
        | 'doa'
        | 'studentName'
        | 'fName'
        | 'mName'
        | 'gender'
        | 'dob'
        | 'rollNumber'
        | 'mobileNumber'
        | 'address'
        | 'schoolDistance',
        string
      >
    >
    __udise_class_cache?: Set<number>
    __udise_student_cache?: Map<string, any>
  }
}

const tbody = document.querySelector<HTMLTableElement>(
  'app-student-tracking-cy div.example-container.table-responsive tbody'
)

tbody?.addEventListener('click', async (ev) => {
  if (!ev.ctrlKey && !ev.metaKey) return

  const target = ev.target as HTMLElement
  const td = target.closest('td')
  if (td?.cellIndex !== 1 || target.nodeName !== 'P') return

  const pen = target.textContent?.trim()
  if (!pen) return

  console.log('Filling pen with ', pen)
  await completeStudentProfile(pen)
  console.log('Profile Completed!')
})

async function completeStudentProfile(pen: string) {
  const std = document.querySelector<HTMLSelectElement>(
    'app-student-tracking-cy select:has(option[value="1"]:first-child)'
  )?.value
  if (!std) {
    alert('Please select class first!')
    return
  }
  // window.__pen_sd_data?.get()
  const sdDetails = await getShalaDarpanDetails(pen)
  if (!sdDetails) return
  const classMap = await ensureClassList(+std)
  const student = classMap.get(pen)
  switch (student.formStatus) {
    case 0:
      await completeStudentProfileStep1(pen, sdDetails)

    default:
      break
  }
}

async function ensureClassList(cl: number) {
  window.__udise_student_cache ??= new Map()
  window.__udise_class_cache ??= new Set()

  if (!window.__udise_class_cache.has(cl)) {
    window.__udise_class_cache.add(cl)

    const data = await getClassList(cl)
    for (const student of data) {
      window.__udise_student_cache.set(student.studentCodeNat, student)
    }
  }

  return window.__udise_student_cache
}
async function getClassList(cl: number) {
  const res = await fetch(
    `https://sdms.udiseplus.gov.in/p2/api/cy/students/${getSchoolId()}/${cl}`,
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-IN,en;q=0.9,hi;q=0.8',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      referrer: 'https://sdms.udiseplus.gov.in/g2/',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }
  )
  const { data } = await responseJson(res)
  return data
  return new Map<string, unknown>(data.map((student: any) => [student.studentCodeNat, student]))
}
function getSchoolId() {
  const raw = sessionStorage.getItem('userDetails')
  return raw && JSON.parse(raw)?.userRegionId
}

async function getShalaDarpanDetails(pen: string) {
  let studentData = window.__pen_sd_data?.get(pen)
  if (studentData) return studentData

  let studentProfileRaw = localStorage.getItem('sd_student_profile_data')
  if (!studentProfileRaw) studentProfileRaw = await resetLocalStorage()
  window.__pen_sd_data ??= new Map()

  const lines = studentProfileRaw.split('\r\n')
  const data = lines.find((r) => r.includes(pen))?.split('\t')
  if (!data?.[0]) {
    alert('Student data not found in clipboard data!')
    return
  }
  const [
    srn, // pen
    ,
    doa,
    studentName,
    fName,
    mName,
    gender,
    dob,
    rollNumber,
    mobileNumber,
    address,
    schoolDistance,
  ] = data
  studentData = {
    srn,
    doa,
    studentName,
    fName,
    mName,
    gender,
    dob,
    rollNumber,
    mobileNumber,
    address,
    schoolDistance,
  }
  window.__pen_sd_data.set(pen, studentData)
  return studentData
}

function completeStudentProfileStep1(
  pen: string,
  payload: { fName: string; mName: string; dob: string; mobileNumber: string; address: string }
) {
  const profile = window.__udise_student_cache?.get(pen)
  if (!profile) throw new Error('Student profile not found in cache!')

  return fetch(`https://sdms.udiseplus.gov.in/p2/api/cy/students/${profile.studentId}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-IN,en;q=0.9,hi;q=0.8',
      'content-type': 'application/json',
      'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    },
    referrer: 'https://sdms.udiseplus.gov.in/g2/',
    body: JSON.stringify({
      classId: profile.classId,
      sectionId: profile.sectionId,
      studentId: profile.studentId,
      schoolId: profile.schoolId,
      gender: profile.gender,
      dob: payload.dob.replaceAll('-', '/') || profile.dob,
      motherName: payload.mName || profile.motherName,
      fatherName: payload.fName || profile.fatherName,
      guardianName: profile.guardianName,
      address: profile.address || profile.address,
      pincode: profile.pincode,
      primaryMobile: payload.mobileNumber || profile.primaryMobile,
      secondaryMobile:
        payload.mobileNumber && payload.mobileNumber === profile.primaryMobile
          ? profile.secondaryMobile
          : profile.primaryMobile,
      email: profile.email,
      motherTongue: profile.motherTongue || 56, // marwari
      socCatId: profile.socCatId,
      minorityId: profile.minorityId,
      isBplYN: profile.isBplYN,
      aayBplYN: profile.aayBplYN,
      ewsYN: profile.ewsYN,
      cwsnYN: profile.cwsnYN,
      natIndYN: profile.natIndYN,
      impairmentType: profile.impairmentType,
      impairmentPercent: profile.impairmentPercent,
      disabilityCerti: profile.disabilityCerti,
      ooscMainstreamedYN: profile.ooscMainstreamedYN,
      ooscYN: profile.ooscYN,
      studentCodeState: profile.studentCodeState,
      bloodGroup: profile.bloodGroup || 9, // under investigation
      ageCheckSkipped: profile.ageCheckSkipped,
      uuid: '',
      nameAsUuid: '',
      uuidUpdateYN: 2, //
      certifiedCheckCount: 0, //
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  })
}
//

const schoolHead = document.querySelector<HTMLUListElement>(
  'app-welcome-user-details1 ul.WelcomeSchool'
)
if (!schoolHead) throw new Error('')
schoolHead.addEventListener('click', handleFormFill)

async function handleFormFill(ev: MouseEvent) {
  if (ev.ctrlKey || ev.metaKey) await resetLocalStorage()
  return

  const pen = document.querySelector(
    'app-edit-student-new-ac ul.SchoolViewShow span.defined'
  )?.textContent
  if (!pen) {
    alert('PEN not found on the page!')
    return
  }
  const student = await getShalaDarpanDetails(pen)
  const formStep = getFormStep()

  switch (formStep) {
    case '1': {
      const form = document.querySelector<HTMLFormElement>('app-general-info-edit-new-ac form')
      break
    }
    case '2': {
      break
    }
    case '3': {
      break
    }

    default:
      break
  }
}

async function resetLocalStorage() {
  window.__pen_sd_data = new Map()
  const studentProfileRaw = await readClipboardText()
  localStorage.setItem('sd_student_profile_data', studentProfileRaw)
  console.log('ShalaDarpan data reset!')

  return studentProfileRaw
}

async function readClipboardText() {
  try {
    return await navigator.clipboard.readText()
  } catch (_) {
    throw new Error('Please, keep your mouse focus on the page and then try again!')
  }
}

function responseJson(res: Response) {
  if (res.ok) return res.json()
  throw new Error(`HTTP error! status: ${res.status}`)
}

// trash

function getFormStep() {
  return document
    .querySelector('.mat-horizontal-stepper-header-container mat-step-header[aria-selected=true]')
    ?.getAttribute('aria-posinset')
}
function generateEnum<const T extends string[]>(keys: T) {
  return Object.fromEntries(keys.map((k, i) => [k, i])) as Record<(typeof keys)[number], number>
}
const mm = generateEnum([
  'srn',
  'pen',
  'doa',
  'studentName',
  'fName',
  'mName',
  'gender',
  'dob',
  'rollNumber',
  'mobileNumber',
  'address',
  'schoolDistance',
])
