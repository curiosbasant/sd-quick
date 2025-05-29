export function createButton(props: {
  className?: string
  children?: string
  title?: string
  onClick: (ev: MouseEvent) => void
  signal?: AbortSignal
}) {
  const button = document.createElement('button')
  button.type = 'button'
  props.title && (button.title = props.title)
  props.className && (button.className = props.className)
  button.textContent = props.children ?? null
  button.addEventListener('click', props.onClick, props)
  return button
}
