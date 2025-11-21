fetch('https://sdms.udiseplus.gov.in/p2/api/cy/students/1103032105', {
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
  body: '{"classId":"12","sectionId":"1","studentId":"1103032105","schoolId":"1718884","uuidUpdateYN":2,"gender":1,"dob":"02/05/2010","motherName":"SUFHIYA KHATU","fatherName":"MUMTAJ KHAN","guardianName":"MUMTAJ KHAN","uuid":"","nameAsUuid":"","address":"kalara phalodi kalara phalodi","pincode":342301,"primaryMobile":"9928335072","secondaryMobile":"","email":"","motherTongue":56,"socCatId":4,"minorityId":1,"isBplYN":2,"aayBplYN":9,"ewsYN":2,"cwsnYN":2,"natIndYN":1,"impairmentType":null,"impairmentPercent":"","disabilityCerti":"","ooscMainstreamedYN":"9","ooscYN":2,"studentCodeState":"104098602","bloodGroup":9,"certifiedCheckCount":0,"ageCheckSkipped":2}',
  method: 'POST',
  mode: 'cors',
  credentials: 'include',
})

// step-1 https://sdms.udiseplus.gov.in/p2/api/cy/students/1103032105
const step1 = {
  classId: '12',
  sectionId: '1',
  studentId: '1103032105',
  schoolId: '1718884',
  uuidUpdateYN: 2,
  gender: 1,
  dob: '02/05/2010',
  motherName: 'SUFHIYA',
  fatherName: 'MUMTAJ KHAN',
  guardianName: 'MUMTAJ KHAN',
  uuid: '',
  nameAsUuid: '',
  address: 'kalara phalodi kalara phalodi',
  pincode: 342301,
  primaryMobile: '9928335072',
  secondaryMobile: '',
  email: '',
  motherTongue: 56,
  socCatId: 4,
  minorityId: 1,
  isBplYN: 2,
  aayBplYN: 9,
  ewsYN: 2,
  cwsnYN: 2,
  natIndYN: 1,
  impairmentType: null,
  impairmentPercent: '',
  disabilityCerti: '',
  ooscMainstreamedYN: '9',
  ooscYN: 2,
  studentCodeState: '104098602',
  bloodGroup: 9,
  certifiedCheckCount: 0,
  ageCheckSkipped: 2,
}

// step-2 https://sdms.udiseplus.gov.in/p2/api/v2/students/enrolment/1102879823
const step2 = {
  academicStream: 1,
  admnNumber: '2352',
  rollNumber: '1202',
  admnStartDate: '18/10/2021',
  attendancePy: 173,
  classPY: 11,
  enrStatusPY: 1,
  examMarksPy: 44,
  examResultPy: 1,
  schoolId: '1718884',
  studentId: '1102879823',
  moiId: 4,
  languageGroup: 1001,
  subjectGroup: [101, 103, 129],
  certifiedCheckCount: 0,
  enrUnder: 9,
}

// step-3 https://sdms.udiseplus.gov.in/p2/api/v2/AY/students/facility/1102879823
const step3 = {
  studentId: 1103032105,
  schoolId: 1718884,
  facilityYn: 9,
  facProvided: null,
  centralScholarshipYn: 2,
  centralScholarshipId: 0,
  centralScholarship: null,
  stateScholarshipYn: 2,
  otherScholarshipYn: 2,
  scholarshipAmount: null,
  facProvidedCwsnYn: 9,
  facProvidedCwsn: null,
  screenedForSld: 9,
  sldType: 9,
  screenedForAsd: 9,
  screenedForAdhd: 9,
  isEcActivity: 1,
  giftedChildrenYn: 9,
  giftedChildren: null,
  mentorProvided: null,
  nurturanceCmpsState: null,
  nurturanceCmpsNational: null,
  olympdsNlc: 9,
  nccNssYn: 9,
  digitalCapableYn: 9,
  heightInCm: 0,
  weightInKg: 0,
  distanceFrmSchool: 2,
  parentEducation: 1,
  motherUuid: '',
  fatherUuid: '',
  guardianUuidUpdateYN: null,
  stateSpecificUuidType: 0,
  guardianUuid: '',
}

// step 4 - https://sdms.udiseplus.gov.in/p2/api/v2/students/submit/1102879823
1102879823

// classlist per student details
const studentDetailsExample = {
  studentId: 1103032105,
  studentCodeNat: '20392109113',
  studentCodeState: '104098602',
  schoolId: 1718884,
  studentName: 'AASIF KHAN',
  gender: 1,
  genderDesc: null,
  socCatId: 4,
  socialCategoryList: null,
  socialCategoryDesc: null,
  minorityId: 1,
  minorityDesc: null,
  uuid: '********0888',
  uuidMasked: null,
  isUuidAvailable: 1,
  isValidUuid: 1,
  nameAsUuid: 'AASIF',
  uuidStatus: 0,
  uuidStatusDesc: 'Verification Under Process',
  uuidValidateRemarks: 'Not Defined',
  uuidValidateDate: '',
  dob: '02/05/2010',
  guardianName: 'MUMTAJ KHAN',
  fatherName: 'MUMTAJ KHAN',
  motherName: 'SUFHIYA',
  address: 'kalara phalodi kalara phalodi',
  pincode: 342301,
  primaryMobile: '9928335072',
  secondaryMobile: '',
  isBplYN: 2,
  aayBplYN: 9,
  ewsYN: 2,
  cwsnYN: 2,
  natIndYN: 1,
  motherTongue: 56,
  motherTongueDesc: '56 - HINDI - Marwari',
  email: '',
  acYearId: 9,
  lastYearId: null,
  lastYearIdDesc: null,
  classId: 12,
  classDesc: 'XII',
  classPyId: null,
  classPyDesc: null,
  sectionDesc: 'A',
  sectionPyDesc: null,
  sectionId: 1,
  impairmentType: null,
  disabilityCerti: 9,
  impairmentPercent: 0,
  ooscYN: 2,
  ooscMainstreamedYN: 9,
  profileStatus: null,
  formStatus: 1,
  ageCheckSkipped: 2,
  academicStreamDesc: null,
  admnNumber: null,
  isRepeater: 2,
  inactiveDate: 'NA',
  statusId: 1,
  statusDesc: 'ACTIVE',
  statusL1Id: 0,
  statusL1Desc: null,
  statusL2Id: 0,
  statusL2Desc: null,
  isNew: 2,
  bloodGroup: 9,
  bloodGroupDesc: null,
  deleteReason: null,
  deleteReasonDesc: null,
  schUdiseCode: null,
  schoolName: null,
  yearId: null,
  studentMovType: 2,
  lastModifiedOn: '21/11/2025 02:07:24 AM',
  lastModifiedBy: '08150207301',
  apaarIdStatus: null,
  apaarId: null,
  apaarIdStatusDesc: null,
  schoolPY: null,
  mbuStatusDesc: 'NOT APPLICABLE',
  examFormStatus: 0,
}

// aayBplYN
academicStreamDesc
acYearId
// address
admnNumber
// ageCheckSkipped
apaarId
apaarIdStatus
apaarIdStatusDesc
// bloodGroup
bloodGroupDesc
classDesc
// classId
classPyDesc
classPyId
// cwsnYN
deleteReason
deleteReasonDesc
// disabilityCerti
// dob
// email
// ewsYN
examFormStatus
// fatherName
formStatus
// gender
genderDesc
// guardianName
// impairmentPercent
// impairmentType
inactiveDate
// isBplYN
isNew
isRepeater
isUuidAvailable
isValidUuid
lastModifiedBy
lastModifiedOn
lastYearId
lastYearIdDesc
mbuStatusDesc
minorityDesc
// minorityId
// motherName
// motherTongue
motherTongueDesc
// nameAsUuid
// natIndYN
// ooscMainstreamedYN
// ooscYN
// pincode
// primaryMobile
profileStatus
// schoolId
schoolName
schoolPY
schUdiseCode
// secondaryMobile
sectionDesc
// sectionId
sectionPyDesc
// socCatId
socialCategoryDesc
socialCategoryList
statusDesc
statusId
statusL1Desc
statusL1Id
statusL2Desc
statusL2Id
studentCodeNat
// studentCodeState
// studentId
studentMovType
studentName
// uuid
uuidMasked
uuidStatus
uuidStatusDesc
uuidValidateDate
uuidValidateRemarks
yearId

// npx tsc udise.ts --lib ES2022 --lib dom --target ES2022
