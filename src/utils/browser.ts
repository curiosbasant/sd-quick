export function observeElementPresence<Result extends Element>(options: {
    /** To get the element from the @link{target} */
    selector: string
  /** Trigger every time the selector element changes */
  onPresenceChange: (element: Result | null) => void
  /** The non-changing container to observe from, the element should not update on new requests @default document */
    target?: Element | string | null
    signal?: AbortSignal
}) {
  let previousResult: Result | null = null
  const target =
    (typeof options.target === 'string'
      ? document.querySelector(options.target)
      : options.target) ?? document
  const handleChanges = () => {
    if (options.signal?.aborted) return

    const element = target.querySelector<Result>(options.selector)
    if (previousResult !== element) options.onPresenceChange(element)
    previousResult = element
  }
  handleChanges() // Immediately invoking

  const observer = new MutationObserver(handleChanges)
  observer.observe(target, {
    subtree: true, // observe all descendants
    childList: true, // observe adding/removing of elements
    // disable observing unnecessary details
    attributes: false,
    characterData: false,
  })

  const cleanUpFn = () => observer.disconnect()
  options.signal?.addEventListener('abort', cleanUpFn, { once: true })
  return cleanUpFn
}

export function observeShiftKey(options?: {
  onPress?: (pressed: boolean) => void
  signal?: AbortSignal
}) {
  const state = {
    pressed: false,
    disconnect() {
      document.removeEventListener('keydown', handleKeyChange)
      document.removeEventListener('keyup', handleKeyChange)
    },
  }
  const handleKeyChange = (ev: KeyboardEvent) => {
    if (state.pressed === ev.shiftKey) return
    options?.onPress?.(ev.shiftKey)
    state.pressed = ev.shiftKey
  }

  document.addEventListener('keydown', handleKeyChange, options)
  document.addEventListener('keyup', handleKeyChange, options)
  return state
}

export function setFormElementValue<T extends HTMLInputElement | HTMLSelectElement | RadioNodeList>(
  elements: HTMLFormControlsCollection,
  name: string | string[],
  value: string | ((elem: T) => string)
) {
  const resolveValue = (name: string) => {
    const elem = elements.namedItem(name) as T | null
    elem && (elem.value = typeof value === 'function' ? value(elem) : value)
  }

  typeof name === 'string' ? resolveValue(name) : name.forEach(resolveValue)
}

export function setFavicon(url: string) {
  const favicon =
    document.querySelector<HTMLLinkElement>('#favicon') ??
    (() => {
      const link = document.createElement('link')
      link.id = 'favicon'
      link.rel = 'shortcut icon'
      link.type = 'image/png'
      return document.head.appendChild(link)
    })()

  favicon.href = url
  return favicon
}

const extensionToMimeType = {
  csv: 'text/csv',
  txt: 'text/plain',
}

type FileExtension = keyof typeof extensionToMimeType

export function downloadFile(content: string, fileName: `${string}.${FileExtension}`) {
  const fileExtension = (fileName.split('.').at(-1) as FileExtension) ?? 'txt'
  const blob = new Blob([content], {
    type: `${extensionToMimeType[fileExtension]};charset=utf-8`,
  })
  const fileUrl = URL.createObjectURL(blob)

  const aTag = document.createElement('a')
  aTag.setAttribute('href', fileUrl)
  aTag.setAttribute('download', new Date().toLocaleString() + '_' + fileName)
  aTag.style.visibility = 'hidden'
  document.body.appendChild(aTag)
  aTag.click()
  document.body.removeChild(aTag)

  URL.revokeObjectURL(fileUrl)
}

export function printContent(...content: (Node | string)[]) {
  const printPopup = window.open(
    '',
    '',
    'left=2,top=0,toolbar=0,scrollbars=1,status=1;width=350,height=250'
  )

  if (printPopup) {
    printPopup.document.body.style.zoom = '0.9'
    printPopup.document.body.append(...content)
    printPopup.document.close()
    setTimeout(() => {
      printPopup.focus()
      printPopup.print()
      printPopup.close()
    }, 100)
  }
}

export function scrapeTable(selector: string, doc = document) {
  const rows = doc.querySelectorAll<HTMLTableRowElement>(selector + ' tr')
  return [...rows].map((tr) =>
    [...tr.children].map((td) =>
      td.firstElementChild?.matches('select, input')
        ? (td.firstElementChild as HTMLInputElement).value
        : td.textContent?.trim() || ''
    )
  )
}
