import { sleep } from '~/utils'
import { handleResult, UdiseClassStudent, udisePost } from '../utils'

export type Step1 = 'fName' | 'mName' | 'dob' | 'gender' | 'mobileNumber' | 'address' | 'category'

export async function completeStudentGeneralProfile(
  profile: UdiseClassStudent,
  payload: Record<Step1, string>,
) {
  const result = await abc(profile, payload)
  return handleResult(result, '☑️ General Profile Completed!')
}

async function abc(profile: UdiseClassStudent, payload: Record<Step1, string>) {
  const options = {
    classId: profile.classId,
    sectionId: profile.sectionId,
    studentId: profile.studentId,
    schoolId: profile.schoolId,
    gender: getMatchingPosition(['M', 'F', 'T'], profile.gender, payload.gender),
    dob: payload.dob ? payload.dob.replace(/-/g, '/') : profile.dob,
    motherName: payload.mName || profile.motherName,
    fatherName: payload.fName || profile.fatherName,
    guardianName: profile.guardianName,
    address: payload.address || profile.address,
    pincode: profile.pincode,
    primaryMobile: payload.mobileNumber || profile.primaryMobile,
    secondaryMobile:
      payload.mobileNumber && payload.mobileNumber === profile.primaryMobile ?
        profile.secondaryMobile
      : profile.primaryMobile === '9999999999' ? ''
      : profile.primaryMobile,
    email: profile.email,
    motherTongue: profile.motherTongue || 56, // marwari
    socCatId: getMatchingPosition(['GEN', 'SC', 'ST', 'OBC'], profile.socCatId, payload.category),
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
  }

  const makeRequest = (overrides?: Partial<typeof options>) =>
    udisePost(
      `https://sdms.udiseplus.gov.in/p2/api/cy/students/${profile.studentId}`,
      overrides ? { ...options, ...overrides } : options,
    )

  let result = await makeRequest()
  if (result.status || result.error.type !== 'error_duplicate_student_mobile_maximum_use')
    return result
  console.log('Retrying error_duplicate_student_mobile_maximum_use error,', result.error)
  await sleep(3000)

  // first try clearing secondary mobile
  result = await makeRequest({ secondaryMobile: '' })
  if (result.status || result.error.type !== 'error_duplicate_student_mobile_maximum_use')
    return result
  console.log('Retrying error_duplicate_student_mobile_maximum_use error,', result.error)
  await sleep(3000)

  // try to not change the same numbers
  result = await makeRequest({
    primaryMobile: profile.primaryMobile,
    secondaryMobile: profile.secondaryMobile,
  })
  if (result.status || result.error.type !== 'error_duplicate_student_mobile_maximum_use')
    return result
  console.log('Retrying error_duplicate_student_mobile_maximum_use error,', result.error)
  await sleep(3000)

  // try with dummy number
  result = await makeRequest({ primaryMobile: '9999999999', secondaryMobile: '' })

  return result
}

function getMatchingPosition<T>(list: T[], defaultValue: number, value?: T) {
  if (!value) return defaultValue
  const idx = list.indexOf(value)
  return idx === -1 ? defaultValue : idx + 1
}
