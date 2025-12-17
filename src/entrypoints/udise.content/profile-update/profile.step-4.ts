import { handleResult, UdiseClassStudent, udisePost } from '../utils'

// Only for class 9 and 10 class
export async function completeStudentVocationalProfile(profile: UdiseClassStudent) {
  if (profile.classId !== 9 && profile.classId !== 10) return

  const result = await udisePost(
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
  return handleResult(result, '☑️ Vocational Profile Completed!')
}

export async function completeStudentProfilePreview(profile: UdiseClassStudent) {
  const result = await udisePost(
    `https://sdms.udiseplus.gov.in/p2/api/v2/students/submit/${profile.studentId}`,
    profile.studentId,
  )
  return handleResult(result, '🎉 Profile completed!')
}
