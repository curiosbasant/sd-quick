import { UdiseClassStudent, udisePost } from './profile.utils'

// Only for class 9 and 10 class
export async function completeStudentVocationalProfile(profile: UdiseClassStudent) {
  return udisePost(
    `https://sdms.udiseplus.gov.in/p2/api/v2/students/vocational/${profile.studentId}`,
    {
      schoolId: profile.schoolId,
      vocExposureYn: 2, // No
      sector: 0,
      jobRole: 0,
      appVocPy: 3, // Not Applicable
      marksObtained: 999, // disabled
    },
  )
}

export async function completeStudentProfilePreview(profile: UdiseClassStudent) {
  return udisePost(
    `https://sdms.udiseplus.gov.in/p2/api/v2/students/submit/${profile.studentId}`,
    profile.studentId,
  )
}
