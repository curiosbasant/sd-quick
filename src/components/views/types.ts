export type ViewMap = {
  initial: undefined
  tcList: undefined
}

export type ViewName = keyof ViewMap

export type ViewProps<CurrentView extends ViewName = any> = {
  data: ViewMap[CurrentView]
  onViewSelect: <PT extends Exclude<ViewName, CurrentView>>(
    viewName: ViewMap[PT] extends undefined ? PT : [PT, ViewMap[PT]]
  ) => void
  onBack?: () => void
}
