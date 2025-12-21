import { use, useReducer } from 'react'

import { addMarks } from './service'
import { Params, ShaladarpanStudent } from './types'

function reducer(
  draft: { students: ShaladarpanStudent[]; currentIndex: number },
  action: { type: 'marks'; payload: string } | { type: 'previous' | 'next' },
) {
  switch (action.type) {
    case 'marks': {
      const markUpdate = { ...draft.students[draft.currentIndex], marks: action.payload }
      return isNaN(+action.payload) ? draft : (
          {
            ...draft,
            students: draft.students.with(draft.currentIndex, markUpdate),
          }
        )
    }
    case 'previous':
      return draft.currentIndex > 0 ? { ...draft, currentIndex: draft.currentIndex - 1 } : draft
    case 'next':
      return draft.currentIndex < draft.students.length - 1 ?
          { ...draft, currentIndex: draft.currentIndex + 1 }
        : draft
  }

  return draft
}

export function useStudent(studentsPromise: Promise<ShaladarpanStudent[]>) {
  const students = use(studentsPromise)
  const [{ students: optimisticStudents, currentIndex }, dispatch] = useReducer(reducer, {
    students,
    currentIndex: 0,
  })

  return {
    students,
    currentStudent: optimisticStudents[currentIndex],
    currentIndex,
    gotoPreviousStudent: () => dispatch({ type: 'previous' }),
    gotoNextStudent: () => dispatch({ type: 'next' }),
    updateMarks: (marks: string) => dispatch({ type: 'marks', payload: marks }),
  }
}
