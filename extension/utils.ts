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

export function repeatUntil(cb: (done: () => void) => unknown, interval = 5e3) {
  const intervalId = setInterval(cb, interval, () => clearInterval(intervalId))
}

export function randomBetween(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
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

export function makeSdRequest(url = location.href) {
  const fd = new FormData(document.querySelector<HTMLFormElement>('#form1') ?? undefined)

  return fetch(url, {
    method: 'POST',
    body: new URLSearchParams(fd as unknown as string),
  })
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
