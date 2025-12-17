import { handleResult, UdiseClassStudent, udiseGet, udisePost } from '../utils'

export type Step2 = 'srn' | 'doa' | 'rollNumber'

export async function completeStudentEnrolmentProfile(
  profile: UdiseClassStudent,
  payload: Record<Step2, string>,
) {
  if (!payload.rollNumber) throw new Error('No roll number assigned!')
  const result = await abc(profile, payload)
  return handleResult(result, '☑️ Enrolment Profile Completed!')
}

async function abc(profile: UdiseClassStudent, payload: Record<Step2, string>) {
  const result = await udiseGet<any>(
    `https://sdms.udiseplus.gov.in/p2/api/v2/students/enrolment/${profile.studentId}`,
  )
  if (!result.status) return result

  const { attendancePy, classPY, enrStatusPY, examMarksPy, examResultPy, enrUnder } = result.data
  return udisePost(
    `https://sdms.udiseplus.gov.in/p2/api/v2/students/enrolment/${profile.studentId}`,
    {
      academicStream: profile.classId > 10 ? 1 : 0, // arts
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
      moiId: 4, // medium of instruction, hindi
      languageGroup: profile.classId < 6 || profile.classId > 10 ? 1001 : 1006, // hindi_english,hindi_english_sanskrit
      subjectGroup: profile.classId > 10 ? [101, 103, 129] : [], // hindi, history, political science
      certifiedCheckCount: 0,
      enrUnder,
    },
  )
}
