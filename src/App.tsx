import { FC, useState } from 'react'
import { InitialView } from '~/components/views/initial'
import { ViewMap, ViewName, ViewProps } from '~/components/views/types'
import { TcListView } from './components/views/tc-list'

type StateType = {
  [P in keyof ViewMap]: ViewMap[P] extends undefined ? P : [P, ViewMap[P]]
}[keyof ViewMap]

export default function App() {
  const [selectedView, setSelectedView] = useState<StateType[]>([])
  const view = selectedView.at(-1) ?? 'initial'
  const CurrentView = views[typeof view === 'string' ? view : view[0]]

  return (
    <CurrentView
      data={Array.isArray(view) && view[1]}
      onViewSelect={(newView) => setSelectedView((prev) => [...prev, newView])}
      onBack={() => setSelectedView((prev) => prev.toSpliced(-1, 1))}
    />
  )
}

const views: Record<ViewName, FC<ViewProps>> = {
  initial: InitialView,
  tcList: TcListView,
}
