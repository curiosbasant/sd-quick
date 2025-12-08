import { sleep } from '~/utils'
import { completeStudentProfile } from './profile.complete'
import { getUdiseClassStudents, refreshShalaDarpanDetails } from './profile.utils'

export function handleClassListPage() {
  const tbody = document.querySelector<HTMLTableElement>(
    'app-student-tracking-cy div.example-container.table-responsive tbody',
  )

  tbody?.addEventListener('click', async (ev) => {
    if (!ev.altKey) return

    const target = ev.target as HTMLElement
    const td = target.closest('td')
    if (td?.cellIndex !== 1 || target.nodeName !== 'P') return

    const pen = target.textContent?.trim()
    if (!pen) return

    await completeStudentProfile(pen, td.parentElement as HTMLTableRowElement)
  })

  //
  const schoolHead = document.querySelector<HTMLUListElement>(
    'app-welcome-user-details1 ul.WelcomeSchool',
  )
  if (!schoolHead) console.error('school head not found!')

  schoolHead?.addEventListener('click', async (ev) => {
    if (ev.altKey) await refreshShalaDarpanDetails()
  })

  //
  const classSearchLabelListItem = document.querySelector<HTMLUListElement>(
    'app-student-tracking-cy ul.sectionSearch > li',
  )
  if (!classSearchLabelListItem) console.error('classSearchLabelListItem not found!')

  classSearchLabelListItem?.addEventListener('click', async (ev) => {
    if (!ev.altKey) return

    const classSearchValue = (
      (ev.currentTarget as HTMLElement)?.nextElementSibling?.firstElementChild as HTMLSelectElement
    ).value
    if (!classSearchValue) return

    const data = await getUdiseClassStudents(classSearchValue)
    const rows = document.querySelector<HTMLTableSectionElement>(
      'app-student-tracking-cy table > tbody',
    )
    for (let i = 0; i < data.length; i++) {
      const student = data[i]
      const tr = rows?.children[i] as HTMLTableRowElement
      const success = await completeStudentProfile(student.studentCodeNat, tr).catch((err) => {
        console.info(
          'Student with pen %s (%s) got error!\n',
          student.studentCodeNat,
          student.studentId,
          err,
        )
        console.groupEnd()

        return true
      })
      success && (await sleep(6000))
    }

    console.log(`🎉 Class ${classSearchValue} is all complete!`)
    await sleep(500)
    alert(`🎉 Class ${classSearchValue} is all complete!`)
  })
}
