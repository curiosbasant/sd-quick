import { completeStudentProfile } from './profile.complete'
import { refreshShalaDarpanDetails } from './profile.utils'

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

    console.log('Filling profile with pen ', pen)
    try {
      await completeStudentProfile(pen, td.parentElement as HTMLTableRowElement)
      console.log('Profile Completed!')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error(errorMessage)
      alert(errorMessage)
    }
  })

  //
  const schoolHead = document.querySelector<HTMLUListElement>(
    'app-welcome-user-details1 ul.WelcomeSchool',
  )
  if (!schoolHead) console.error('school head not found!')

  schoolHead?.addEventListener('click', async (ev) => {
    if (ev.altKey) await refreshShalaDarpanDetails()
  })
}
