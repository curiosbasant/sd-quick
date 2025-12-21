export type ShaladarpanStudent = {
  stdClass: string
  section: string
  srNo: string
  admissionDate: string
  name: string
  lateStatus: string
  fatherName: string
  motherName: string
  gender: string
  dob: string
  rollNo: string
  examRollNo: string
  totalWorkingDays: string
  totalAttendance: string
  category: string
  religion: string
  previousYearMarks: string
  nameOfSchool: string
  schoolUdiseCode: string
  aadharNo: string
  bhamashahCard: string
  mobileNo: string
  address: string
  annualParentalIncome: string
  cwsnStatus: string
  bplStatus: string
  minorityStatus: string
  ageOnPresent: string
  coCurricularActivity: string
  distanceFromSchool: string
  marks?: string
}

export type Params = {
  class: string
  exam: string
  subject: string
}
