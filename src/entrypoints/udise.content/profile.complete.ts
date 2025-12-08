import { randomBetween, sleep } from '~/utils'
import { completeStudentGeneralProfile } from './profile.step-1'
import { completeStudentEnrolmentProfile } from './profile.step-2'
import { completeStudentFacilityProfile } from './profile.step-3'
import { completeStudentProfilePreview, completeStudentVocationalProfile } from './profile.step-4'
import { getShalaDarpanStudent, getUdiseClassStudents, UdiseClassStudent } from './profile.utils'

export async function completeStudentProfile(pen: string, tr?: HTMLTableRowElement) {
  const selectedClass = document.querySelector<HTMLSelectElement>(
    'app-student-tracking-cy select:has(option[value="1"]:first-child)',
  )?.value
  if (!selectedClass) throw new Error('Please select class first!')

  const sdStudent = await getShalaDarpanStudent(pen)
  const udiseStudent = await getUdiseStudent(selectedClass, pen)

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
    console.log(`✅ Profile is already completed for ${sdStudent.studentName} with pen ${pen}!`)
    return
  }

  try {
    console.group(`📝 Working on %s, (%s,%s)`, sdStudent.studentName, pen, udiseStudent.studentId)
    tr?.classList.add('inProgress')

    const lastTd = tr?.lastElementChild as HTMLTableCellElement
    for (let index = udiseStudent.formStatus; index < steps.length; index++) {
      const completeProfileStep = steps[index]
      await completeProfileStep(udiseStudent, sdStudent).then(console.info)
      lastTd?.children[index].classList.add('submit')
      lastTd?.children[index].classList.remove('incomplete')
      await sleep(randomBetween(500, 800)) // Slow down a bit
    }

    // Last step, complete profile
    await completeStudentProfilePreview(udiseStudent).then(console.info)
    // get last 2nd element, as the last element is ul list
    const img = lastTd?.children[lastTd.childElementCount - 2]
      ?.firstElementChild as HTMLImageElement
    img && (img.src = './assets/img/complete.png')

    await sleep(randomBetween(500, 800)) // Slow down a bit
    // mark row as completed
    const statusTd = tr?.lastElementChild?.previousElementSibling?.firstElementChild
    if (statusTd) {
      statusTd.textContent = 'Completed'
      statusTd.classList = 'Completed'
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    if (tr) {
      const p = document.createElement('p')
      p.textContent = errorMessage
      p.style.color = '#fb5454'
      p.style.fontSize = 'smaller'
      p.style.margin = '8px 0 0'
      tr.children[5].appendChild(p)
    }
    console.error(err)
  } finally {
    console.groupEnd()
    tr?.classList.remove('inProgress')
  }
}

async function getUdiseStudent(cl: string, pen: string) {
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

  const student = window.__udise_student_cache.get(pen)
  if (!student) {
    throw new Error(`UDISE+ student with pen ${pen} not found in class ${cl}!`)
  }
  return student as UdiseClassStudent
}
