export {}

type Step1 = 'fName' | 'mName' | 'dob' | 'mobileNumber' | 'address'
type Step2 = 'srn' | 'doa' | 'rollNumber'
type Step3 = 'schoolDistance' | 'age' | 'gender'

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
        | 'age'
        | 'schoolDistance',
        string
      >
    >
    __udise_class_cache?: Set<number>
    __udise_student_cache?: Map<string, UdiseClassStudent>
  }
}

const tbody = document.querySelector<HTMLTableElement>(
  'app-student-tracking-cy div.example-container.table-responsive tbody',
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
    'app-student-tracking-cy select:has(option[value="1"]:first-child)',
  )?.value
  if (!std) {
    alert('Please select class first!')
    return
  }

  const sdDetails = await getShalaDarpanDetails(pen)
  if (!sdDetails) return
  const schoolStudents = await ensureClassList(+std)
  const student = schoolStudents.get(pen)
  switch (student?.formStatus) {
    case 0:
      await completeStudentProfileStep1(student, sdDetails)
    case 1:
      await completeStudentProfileStep2(student, sdDetails)
    case 2:
      await completeStudentProfileStep3(student, sdDetails)
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
    },
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

  const lines = studentProfileRaw.split(navigator.userAgent.includes('Windows') ? '\r\n' : '\n')
  const data = lines.find((r) => r.includes(pen))?.split('\t')
  if (!data?.[0]) {
    alert('Student data not found in clipboard data!')
    return
  }
  const [
    srn,
    _pen, // unused
    doa,
    studentName,
    fName,
    mName,
    gender,
    dob,
    rollNumber,
    mobileNumber,
    address,
    age,
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
    age,
    schoolDistance,
  }
  window.__pen_sd_data.set(pen, studentData)
  return studentData
}

function completeStudentProfileStep1(profile: UdiseClassStudent, payload: Record<Step1, string>) {
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
      dob: payload.dob ? payload.dob.replace(/-/g, '/') : profile.dob,
      motherName: payload.mName || profile.motherName,
      fatherName: payload.fName || profile.fatherName,
      guardianName: profile.guardianName,
      address: profile.address || profile.address,
      pincode: profile.pincode,
      primaryMobile: payload.mobileNumber || profile.primaryMobile,
      secondaryMobile:
        payload.mobileNumber && payload.mobileNumber === profile.primaryMobile ?
          profile.secondaryMobile
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
async function completeStudentProfileStep2(
  profile: UdiseClassStudent,
  payload: Record<Step2, string>,
) {
  const { data } = await fetch(
    `https://sdms.udiseplus.gov.in/p2/api/v2/students/enrolment/${profile.studentId}`,
    {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-IN,en;q=0.9,hi;q=0.8',
      },
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
  ).then(responseJson)
  if (!data) return
  const { attendancePy, classPY, enrStatusPY, examMarksPy, examResultPy, enrUnder } = data
  return fetch(`https://sdms.udiseplus.gov.in/p2/api/v2/students/enrolment/${profile.studentId}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-IN,en;q=0.9,hi;q=0.8',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      academicStream: 1, // arts
      admnNumber: payload.srn,
      rollNumber: payload.rollNumber,
      admnStartDate: payload.doa.replace(/-/g, '/'),
      attendancePy,
      classPY, // class of previous year
      enrStatusPY, // previous year study status
      examMarksPy,
      examResultPy,
      schoolId: profile.schoolId,
      studentId: profile.studentId,
      moiId: 4, // medium of instruction
      languageGroup: 1001, // hindi_english
      subjectGroup: [101, 103, 129], // hindi, history, political science
      certifiedCheckCount: 0,
      enrUnder,
    }),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  })
}
function completeStudentProfileStep3(profile: UdiseClassStudent, payload: Record<Step3, string>) {
  const { heightCm, weightKg } = getRandomHeightWeight(
    +payload.age,
    payload.gender === 'M' ? 'male' : 'female',
  )

  return fetch(
    `https://sdms.udiseplus.gov.in/p2/api/v2/AY/students/facility/${profile.studentId}`,
    {
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
        schoolId: profile.schoolId,
        facilityYn: '1',
        facProvided: [1, 2], // free textbook and uniform
        facProvidedCwsnYn: 9, // disabled
        facProvidedCwsn: null,
        screenedForSld: 2,
        sldType: 9,
        screenedForAsd: 2,
        screenedForAdhd: 2,
        giftedChildrenYn: '2',
        olympdsNlc: 2,
        nccNssYn: 2,
        digitalCapableYn: +payload.age > 12 ? 1 : 2,
        weightInKg: weightKg,
        heightInCm: heightCm,
        distanceFrmSchool: sdToUdiseDistance(+payload.schoolDistance),
        parentEducation: getRandomParentEducation(),
        motherUuid: '',
        guardianUuid: '',
        stateSpecificUuidType: 2,
        motherUuidUpdateYN: 9,
        guardianUuidUpdateYN: 9,
        fatherUuid: '',
        fatherUuidUpdateYN: 9,
      }),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    },
  )
}
function sdToUdiseDistance(distance: number) {
  if (distance < 1) return 1
  if (distance < 3) return 2
  if (distance < 5) return 3
  return 4
}
function getRandomParentEducation() {
  const random = Math.random()

  // Cumulative probability thresholds
  if (random < 0.3) return 1 // 0.00 - 0.30 (30%) Primary
  if (random < 0.5) return 2 // 0.30 - 0.50 (20%) Upper Primary
  if (random < 0.65) return 3 // 0.65 - 0.65 (15%) Secondary
  if (random < 0.75) return 4 // 0.65 - 0.75 (10%) Higher Secondary
  if (random < 0.8) return 5 // 0.75 - 0.80 (5%) More than Higher Secondary
  return 6 // 0.80 - 1.00 (20%) No Schooling
}

function getRandomHeightWeight(age: number, gender: 'male' | 'female') {
  // Growth data by age and gender (cm and kg)
  const data: Record<
    number,
    Record<'male' | 'female', Record<'height' | 'weight', [number, number]>>
  > = {
    5: {
      male: {
        height: [102, 115],
        weight: [14, 21],
      },
      female: {
        height: [100, 112],
        weight: [13, 20],
      },
    },
    6: {
      male: {
        height: [107, 121],
        weight: [16, 23],
      },
      female: {
        height: [105, 118],
        weight: [15, 22],
      },
    },
    7: {
      male: {
        height: [112, 127],
        weight: [18, 26],
      },
      female: {
        height: [110, 124],
        weight: [17, 25],
      },
    },
    8: {
      male: {
        height: [117, 132],
        weight: [20, 30],
      },
      female: {
        height: [115, 130],
        weight: [19, 29],
      },
    },
    9: {
      male: {
        height: [122, 138],
        weight: [23, 34],
      },
      female: {
        height: [120, 136],
        weight: [22, 33],
      },
    },
    10: {
      male: {
        height: [127, 145],
        weight: [25, 39],
      },
      female: {
        height: [125, 143],
        weight: [24, 38],
      },
    },
    11: {
      male: {
        height: [133, 152],
        weight: [28, 44],
      },
      female: {
        height: [130, 150],
        weight: [28, 44],
      },
    },
    12: {
      male: {
        height: [138, 158],
        weight: [32, 50],
      },
      female: {
        height: [136, 157],
        weight: [32, 49],
      },
    },
    13: {
      male: {
        height: [144, 165],
        weight: [36, 56],
      },
      female: {
        height: [142, 163],
        weight: [36, 55],
      },
    },
    14: {
      male: {
        height: [150, 171],
        weight: [41, 62],
      },
      female: {
        height: [147, 165],
        weight: [41, 58],
      },
    },
    15: {
      male: {
        height: [157, 175],
        weight: [47, 68],
      },
      female: {
        height: [150, 167],
        weight: [44, 60],
      },
    },
    16: {
      male: {
        height: [163, 178],
        weight: [52, 73],
      },
      female: {
        height: [151, 168],
        weight: [46, 62],
      },
    },
    17: {
      male: {
        height: [166, 180],
        weight: [55, 75],
      },
      female: {
        height: [152, 169],
        weight: [47, 63],
      },
    },
    18: {
      male: {
        height: [168, 182],
        weight: [58, 78],
      },
      female: {
        height: [153, 170],
        weight: [48, 65],
      },
    },
    19: {
      male: {
        height: [169, 183],
        weight: [59, 80],
      },
      female: {
        height: [153, 170],
        weight: [49, 66],
      },
    },
    20: {
      male: {
        height: [170, 184],
        weight: [60, 82],
      },
      female: {
        height: [153, 171],
        weight: [50, 67],
      },
    },
    21: {
      male: {
        height: [170, 185],
        weight: [61, 83],
      },
      female: {
        height: [153, 171],
        weight: [50, 68],
      },
    },
    22: {
      male: {
        height: [171, 186],
        weight: [61, 84],
      },
      female: {
        height: [153, 171],
        weight: [50, 68],
      },
    },
    23: {
      male: {
        height: [171, 187],
        weight: [62, 85],
      },
      female: {
        height: [153, 172],
        weight: [50, 69],
      },
    },
    24: {
      male: {
        height: [171, 188],
        weight: [62, 86],
      },
      female: {
        height: [153, 172],
        weight: [51, 69],
      },
    },
    25: {
      male: {
        height: [171, 188],
        weight: [63, 87],
      },
      female: {
        height: [153, 172],
        weight: [51, 70],
      },
    },
  }

  // Validate inputs
  if (age < 5 || age > 25) {
    return {
      error: 'Age must be between 5 and 25 years.',
    }
  }
  if (gender && gender !== 'male' && gender !== 'female') {
    return {
      error: "Gender must be 'male' or 'female'.",
    }
  }

  const entry =
    gender ?
      data[age][gender]
    : {
        height: [data[age].female.height[0], data[age].male.height[1]],
        weight: [data[age].female.weight[0], data[age].male.weight[1]],
      }

  // Helper to generate a random number within a range
  const randomInRange = (min, max) => Math.round(Math.random() * (max - min) + min)

  // Generate random height and weight
  return {
    heightCm: randomInRange(...entry.height),
    weightKg: randomInRange(...entry.weight),
  }
}

console.log(getRandomHeightWeight(15, 'male'))
console.log(getRandomHeightWeight(10, 'female'))
console.log(getRandomHeightWeight(7))

const schoolHead = document.querySelector<HTMLUListElement>(
  'app-welcome-user-details1 ul.WelcomeSchool',
)
if (!schoolHead) throw new Error('school head not found!')
schoolHead.addEventListener('click', async (ev) => {
  if (ev.ctrlKey || ev.metaKey) await resetLocalStorage()
})

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

type UdiseClassStudent = {
  studentId: number
  studentCodeNat: string
  studentCodeState: string
  schoolId: number
  studentName: string
  gender: number
  genderDesc: string | null
  socCatId: number
  socialCategoryList: unknown | null
  socialCategoryDesc: string | null
  minorityId: number
  minorityDesc: string | null
  uuid: string
  uuidMasked: string | null
  isUuidAvailable: number
  isValidUuid: number
  nameAsUuid: string
  uuidStatus: number
  uuidStatusDesc: string
  uuidValidateRemarks: string
  uuidValidateDate: string
  dob: string
  guardianName: string
  fatherName: string
  motherName: string
  address: string
  pincode: number
  primaryMobile: string
  secondaryMobile: string
  isBplYN: number
  aayBplYN: number
  ewsYN: number
  cwsnYN: number
  natIndYN: number
  motherTongue: number
  motherTongueDesc: string
  email: string
  acYearId: number
  lastYearId: number | null
  lastYearIdDesc: string | null
  classId: number
  classDesc: string
  classPyId: number | null
  classPyDesc: string | null
  sectionDesc: string
  sectionPyDesc: string | null
  sectionId: number
  impairmentType: unknown | null
  disabilityCerti: number
  impairmentPercent: number
  ooscYN: number
  ooscMainstreamedYN: number
  profileStatus: unknown | null
  formStatus: number
  ageCheckSkipped: number
  academicStreamDesc: string | null
  admnNumber: string | null
  isRepeater: number
  inactiveDate: string
  statusId: number
  statusDesc: string
  statusL1Id: number
  statusL1Desc: string | null
  statusL2Id: number
  statusL2Desc: string | null
  isNew: number
  bloodGroup: number
  bloodGroupDesc: string | null
  deleteReason: string | null
  deleteReasonDesc: string | null
  schUdiseCode: string | null
  schoolName: string | null
  yearId: number | null
  studentMovType: number
  lastModifiedOn: string
  lastModifiedBy: string
  apaarIdStatus: string | null
  apaarId: string | null
  apaarIdStatusDesc: string | null
  schoolPY: unknown | null
  mbuStatusDesc: string
  examFormStatus: number
}

// trash

async function handleFormFill(ev: MouseEvent) {
  if (ev.ctrlKey || ev.metaKey) await resetLocalStorage()

  const pen = document.querySelector(
    'app-edit-student-new-ac ul.SchoolViewShow span.defined',
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
