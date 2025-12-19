import { sleep } from '~/utils'
import { completeStudentProfile } from './profile.complete'
import { refreshShalaDarpanDetails } from '../utils'

export function handleProfileUpdate() {
  // complete single student profile
  const tbody = document.querySelector<HTMLTableElement>(
    'app-student-tracking-cy div.example-container.table-responsive tbody',
  )
  tbody?.addEventListener('click', async (ev) => {
    if (!ev.altKey) return

    const target = ev.target as HTMLElement
    const td = target.closest('td')
    if (td?.cellIndex !== 1 || target.nodeName !== 'P') return

    const pen = target.textContent?.trim()
    if (pen) await completeStudentProfile(pen, td.parentElement as HTMLTableRowElement)
  })

  // refresh shaladarpan cache details
  const schoolHead = document.querySelector<HTMLUListElement>(
    'app-welcome-user-details1 ul.WelcomeSchool',
  )
  if (!schoolHead) console.error('school head not found!')
  schoolHead?.addEventListener('click', async (ev) => {
    if (ev.altKey) await refreshShalaDarpanDetails()
  })

  // complete all students in a class
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

    const rows = document.querySelectorAll<HTMLTableRowElement>(
      'app-student-tracking-cy table > tbody > tr',
    )

    if (rows) {
      for (const tr of rows) {
        const pen = tr.querySelector('td:nth-child(2) p')?.textContent?.trim()
        if (!pen) continue

        await completeStudentProfile(pen, tr)
      }
    } else if (window.__udise_student_cache) {
      for (const student of window.__udise_student_cache.values()) {
        if (student.classId !== +classSearchValue) continue

        await completeStudentProfile(student.studentCodeNat)
      }
    }

    console.log(`🎉 Class ${classSearchValue} is all complete!`)
    await sleep(500)
    alert(`🎉 Class ${classSearchValue} is all complete!`)
  })
}
