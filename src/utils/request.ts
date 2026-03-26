import { parseHtmlString } from './parsers'

export function makeSdRequest(
  payload: Record<string, string | number> | HTMLElement,
  url = location.pathname,
) {
  const fd = toFormData(payload)

  return fetch(url, {
    method: 'POST',
    body: new URLSearchParams(fd as unknown as undefined),
  }).then(resolveDocument)
}

function toFormData(payload: Record<string, string | number> | HTMLElement) {
  if (!payload) throw new TypeError('Payload Required')

  const formElem = document.querySelector<HTMLFormElement>('#form1') ?? undefined
  return payload instanceof HTMLElement ?
      new FormData(formElem, payload)
    : Object.entries(payload).reduce(
        (fd, [key, value]) => (fd.set(key, value.toString()), fd),
        new FormData(formElem),
      )
}

export function responseJson(res: Response) {
  if (res.ok) return res.json()
  throw new Error(`HTTP error! status: ${res.status}`)
}

export function resolveDocument(res: Response) {
  if (res.ok) return res.text().then(parseHtmlString)
  throw new Error('Response not okay!')
}
