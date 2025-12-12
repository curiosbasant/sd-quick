import { parseHtmlString } from './parsers'

export function makeSdRequest(url = location.href, payload = {}) {
  const fd = new FormData(document.querySelector<HTMLFormElement>('#form1') ?? undefined)

  for (const [key, value] of Object.entries<string>(payload)) {
    fd.set(key, value)
  }

  return fetch(url, {
    method: 'POST',
    body: new URLSearchParams(fd as unknown as string),
  }).then(resolveDocument)
}

export function responseJson(res: Response) {
  if (res.ok) return res.json()
  throw new Error(`HTTP error! status: ${res.status}`)
}

export function resolveDocument(res: Response) {
  if (res.ok) return res.text().then(parseHtmlString)
  throw new Error('Response not okay!')
}
