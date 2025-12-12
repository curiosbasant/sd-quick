import { readClipboardText, responseJson } from '~/utils'

export async function getShalaDarpanStudent(pen: string) {
  let studentData = window.__sd_profiles_cache?.get(pen)
  if (studentData) return studentData

  let studentProfileRaw = localStorage.getItem('sd_student_profiles')
  if (!studentProfileRaw) studentProfileRaw = await refreshShalaDarpanDetails()
  window.__sd_profiles_cache ??= new Map()

  const records = studentProfileRaw.split(navigator.userAgent.includes('Windows') ? '\r\n' : '\n')
  const data = records.find((r) => r.toLowerCase().includes(pen))?.split('\t')
  console.log(data)

  if (!data?.[3]) throw new Error(`ShalaDarpan details for pen ${pen} not found!`)

  const [
    _pen, // unused
    srn,
    doa,
    studentName,
    fName,
    mName,
    gender,
    dob,
    rollNumber,
    category,
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
    category,
    mobileNumber,
    address,
    age,
    schoolDistance,
  }
  window.__sd_profiles_cache.set(pen, studentData)
  return studentData
}

export async function getUdiseStudent(key: string) {
  const cacheSize = window.__udise_student_cache?.size ?? 0
  if (cacheSize === 0) await cacheUdiseStudents()

  const student = window.__udise_student_cache?.get(key)
  if (student) return student

  throw new Error(`${key}: UDISE+ Student not found!`)
}

async function cacheUdiseStudents() {
  const result = await udiseGet<UdiseClassStudent[]>(
    `https://sdms.udiseplus.gov.in/p2/api/cy/students/all/${getSchoolId()}`,
  )
  if (!result.status) throw new Error(`Failed to get UDISE+ students!`)

  window.__udise_student_cache ??= new Map()
  for (const student of result.data) {
    const key = student.classId === 1 ? student.studentName.toLowerCase() : student.studentCodeNat
    window.__udise_student_cache.set(key, student)
  }
}

export async function refreshShalaDarpanDetails() {
  const studentProfileRaw = (await readClipboardText()).trim()
  if (!studentProfileRaw) throw new Error('Clipboard is empty!')

  const [shouldBeSr] = studentProfileRaw.split('\t', 1)
  if (
    !/^\d{11}$/.test(shouldBeSr)
    && +!shouldBeSr.startsWith('NA')
    && +!shouldBeSr.startsWith('#N/A')
  )
    throw new Error(`Invalid clipboard data.\n\n${studentProfileRaw.slice(0, 50)}...`)

  localStorage.setItem('sd_student_profiles', studentProfileRaw)
  console.log('ShalaDarpan cache refreshed!')

  window.__sd_profiles_cache = new Map()
  return studentProfileRaw
}

export function getSchoolId() {
  const raw = sessionStorage.getItem('userDetails')
  return raw && JSON.parse(raw)?.userRegionId
}

export function udiseGet<T>(
  url: string | URL,
  payload?: string[][] | Record<string, string> | string | URLSearchParams,
) {
  let modifiedUrl = url
  if (payload) {
    modifiedUrl = typeof url === 'string' ? new URL(url) : url
    const searchParams = new URLSearchParams(payload)
    for (const [name, value] of searchParams) {
      modifiedUrl.searchParams.append(name, value)
    }
  }

  return fetch(modifiedUrl, {
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
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  }).then<UdiseResult<T>>(responseJson)
}
export function udisePost<T>(url: string | URL, payload: unknown) {
  return fetch(url, {
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
    body: JSON.stringify(payload),
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
  }).then<UdiseResult<T>>(responseJson)
}

export function handleResult<T>(result: UdiseResult, message: T) {
  if (result.status) return message
  const fieldErrorMessages =
    result.error.data
    && Object.values(result.error.data.errorFields)
      .map((m) => `\n -- ${m}`)
      .join()
  throw new Error((result.error.message || 'Unknown error occurred') + (fieldErrorMessages ?? ''))
}

export type UdiseResult<T = any> =
  | {
      status: true
      data: T
    }
  | {
      status: false
      error: {
        message: string
        type: string
        data?: {
          errorFields: Record<string, string>
        }
      }
    }

export type UdiseClassStudent = {
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
