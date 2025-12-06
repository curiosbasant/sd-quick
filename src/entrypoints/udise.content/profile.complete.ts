import { randomBetween, sleep } from '~/utils'
import { completeStudentGeneralProfile } from './profile.step-1'
import { completeStudentEnrolmentProfile } from './profile.step-2'
import { completeStudentFacilityProfile } from './profile.step-3'
import { completeStudentProfilePreview, completeStudentVocationalProfile } from './profile.step-4'
import {
  getSchoolId,
  getShalaDarpanStudent,
  getUdiseClassStudents,
  UdiseClassStudent,
  udiseGet,
  UdiseResult,
} from './profile.utils'

export async function completeStudentProfile(pen: string, tr?: HTMLTableRowElement) {
  const sdStudent = await getShalaDarpanStudent(pen)
  if (!sdStudent.rollNumber) return false
  const udiseStudent = await getUdiseStudent(pen)

  const steps =
    udiseStudent.classId === 9 || udiseStudent.classId === 10 ?
      [
        completeStudentGeneralProfile,
        completeStudentEnrolmentProfile,
        completeStudentFacilityProfile,
        completeStudentVocationalProfile,
      ]
    : [
        completeStudentGeneralProfile,
        completeStudentEnrolmentProfile,
        completeStudentFacilityProfile,
      ]

  // skip if already completed
  if (udiseStudent.formStatus >= steps.length) {
    console.info(
      '✅ Profile already completed for pen %s with studentId %s!',
      pen,
      udiseStudent.studentId,
    )
    return false
  }

  console.group(`📝 %s (%s)`, sdStudent.studentName, udiseStudent.studentId)
  console.info('🚀 Starting profile for pen %s with studentId %s', pen, udiseStudent.studentId)
  const lastTd = tr?.lastElementChild as HTMLTableCellElement
  for (let index = udiseStudent.formStatus; index < steps.length; index++) {
    const completeProfileStep = steps[index]
    await completeProfileStep(udiseStudent, sdStudent).then(handleResult)
    lastTd?.children[index].classList.add('submit')
    lastTd?.children[index].classList.remove('incomplete')
    console.info('☑️ Step %s completed!', index + 1)
    await sleep(randomBetween(400, 700)) // Slow down a bit
  }

  // Last step, complete profile
  await completeStudentProfilePreview(udiseStudent).then(handleResult)
  // get last 2nd element, as the last element is ul list
  const img = lastTd?.children[lastTd.childElementCount - 2]?.firstElementChild as HTMLImageElement
  img && (img.src = './assets/img/complete.png')
  console.info('🎉 Profile completed!')
  console.groupEnd()

  // mark row as completed
  const statusTd = tr?.lastElementChild?.previousElementSibling?.firstElementChild
  if (statusTd) {
    statusTd.textContent = 'Completed'
    statusTd.classList = 'Completed'
  }

  return true
}

function handleResult(result: UdiseResult) {
  if (result.status) return result.data
  const fieldErrorMessages =
    result.error.data
    && Object.values(result.error.data.errorFields)
      .map((m) => `\n -- ${m}`)
      .join()
  throw new Error((result.error.message || 'Unknown error occurred') + (fieldErrorMessages ?? ''))
}

async function cachifyUdiseClass(cl: string) {
  window.__udise_class_cache ??= new Set()
  window.__udise_student_cache ??= new Map()

  if (!window.__udise_class_cache.has(cl)) {
    window.__udise_class_cache.add(cl)

    const data = await getUdiseClassStudents(cl)
    for (const student of data) {
      const pen = student.studentCodeNat
      window.__udise_student_cache.set(pen, student)
    }
  }
}

async function getUdiseStudent(pen: string) {
  const size = window.__udise_student_cache?.size ?? 0
  if (size === 0) {
    const result = await udiseGet<UdiseClassStudent[]>(
      `https://sdms.udiseplus.gov.in/p2/api/cy/students/all/${getSchoolId()}`,
    )
    if (!result.status) throw new Error(`Failed to get UDISE+ students!`)

    window.__udise_student_cache ??= new Map()
    for (const student of result.data) {
      window.__udise_student_cache.set(student.studentCodeNat, student)
    }
  }

  const student = window.__udise_student_cache?.get(pen)
  if (student) return student as UdiseClassStudent
  // https://sdms.udiseplus.gov.in/p2/api/cy/students/1103032105
  throw new Error(`UDISE+ student with pen ${pen} not found!`)
}
