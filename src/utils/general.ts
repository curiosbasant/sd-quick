import { parseHtmlString } from './browser'

/**
 * Clamps a number to a specified range.
 */
export const clamp = (num: number, min: number, max: number) =>
  num < min ? min : num > max ? max : num

/**
 * Generates a random ID string.
 */
export const generateRandomId = (size = 8) => Math.random().toString().slice(-clamp(size, 8, 16))

export function createChunks<T>(arr: T[], size: number) {
  const chunks = []
  for (let i = 0; i < arr.length / size; i++) {
    chunks.push(arr.slice(i * size, (i + 1) * size))
  }
  return chunks
}

export function sleep(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}

export function getTableDomContents(tableRows: NodeListOf<HTMLTableRowElement>) {
  return [...tableRows].map((tr) => [...tr.children].map((td) => td.textContent?.trim()))
}

export function resolveJson(res: Response) {
  if (res.ok) return res.json()
  throw new Error('Response not okay!')
}

export function resolveText(res: Response) {
  if (res.ok) return res.text()
  throw new Error('Response not okay!')
}

export function resolveDocument(res: Response) {
  if (res.ok) return res.text().then(parseHtmlString)
  throw new Error('Response not okay!')
}
