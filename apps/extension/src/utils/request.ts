import { parseHtmlString } from './parsers'

export async function makeSdCachedRequest(
  key: string,
  payload: Record<string, string | number> | HTMLInputElement,
  url = location.pathname,
  { staleTime = 1 * 60 * 60 * 1000 } = {}, // 1hr
) {
  const fd = toFormData(payload)

  const cache = await caches.open('sd-request')
  const cacheKey = `${url.slice(4)}?${new URLSearchParams({ key })}`
  const cachedResponse = await cache.match(cacheKey)
  if (cachedResponse) {
    const serverTime = cachedResponse.headers.get('Date')
    const cacheTime = serverTime ? new Date(serverTime).getTime() : Date.now()
    if (Date.now() - cacheTime < staleTime) {
      return cachedResponse.text().then(parseHtmlString)
    }
  }

  const response = await fetch(url, {
    method: 'POST',
    body: new URLSearchParams(fd as unknown as undefined),
  })
  if (!response.ok) throw new Error('Response not okay!')
  await cache.put(cacheKey, response.clone())
  return response.text().then(parseHtmlString)
}

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

  return payload instanceof HTMLElement ?
      new FormData(form1, payload)
    : Object.entries(payload).reduce(
        (fd, [key, value]) => (fd.set(key, value.toString()), fd),
        new FormData(form1),
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
