export function createButton(props: {
  className: string
  children?: string
  onClick: (ev: MouseEvent) => void
}) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = props.className
  button.textContent = props.children ?? null
  button.addEventListener('click', props.onClick)
  return button
}
