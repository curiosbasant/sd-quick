export function setFormElementValue<T extends HTMLInputElement | HTMLSelectElement | RadioNodeList>(
  elements: HTMLFormControlsCollection,
  name: string,
  value: string | ((elem: T) => string)
) {
  const elem = elements.namedItem(name) as T | null
  elem && (elem.value = typeof value === 'function' ? value(elem) : value)
}

export function repeatUntil(cb: (done: () => void) => unknown, interval = 5e3) {
  const intervalId = setInterval(cb, interval, () => clearInterval(intervalId))
}

export function randomBetween(min, max) {
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
