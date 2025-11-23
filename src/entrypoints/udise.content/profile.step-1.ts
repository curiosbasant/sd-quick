import { UdiseClassStudent, udisePost } from './profile.utils'

export type Step1 = 'fName' | 'mName' | 'dob' | 'gender' | 'mobileNumber' | 'address' | 'category'

export function completeStudentGeneralProfile(
  profile: UdiseClassStudent,
  payload: Record<Step1, string>,
) {
  return udisePost(`https://sdms.udiseplus.gov.in/p2/api/cy/students/${profile.studentId}`, {
    classId: profile.classId,
    sectionId: profile.sectionId,
    studentId: profile.studentId,
    schoolId: profile.schoolId,
    gender: getMatchingPosition(['M', 'F', 'T'], profile.gender, payload.gender),
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
  })
}

function getMatchingPosition<T>(list: T[], defaultValue: number, value?: T) {
  if (!value) return defaultValue
  const idx = list.indexOf(value)
  return idx === -1 ? defaultValue : idx + 1
}
