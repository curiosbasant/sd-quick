export * from './apiRequest'

export async function dispatchAction<I, O>(action: {
  type: string | number
  payload?: I
  tabId?: number
}) {
  const tabId =
    action.tabId ??
    (await chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => tab.id))

  return new Promise<O>((resolve, reject) =>
    tabId
      ? chrome.tabs.sendMessage(tabId, { type: action.type, payload: action.payload }, resolve)
      : reject('Tab not found')
  )
}

export async function dispatchBackgroundAction<T>(action: string, payload?: T) {
  return new Promise((resolve) => chrome.runtime.sendMessage({ action, payload }, resolve))
}

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

export function resolveJson(res: Response) {
  if (res.ok) return res.json()
  throw new Error('Invalid Credentials')
}
export function resolveText(res: Response) {
  if (res.ok) return res.text()
  throw new Error('Invalid Credentials')
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

export async function readClipboardText() {
  try {
    return await navigator.clipboard.readText()
  } catch (_) {
    throw new Error('Please, keep your mouse focus on the page and then try again!')
  }
}

export async function copyToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content)
  } catch (_) {
    throw new Error('Please, keep your mouse focus on the page and then try again!')
  }
}

export function sleep(sec: number) {
  return new Promise((resolve) => setTimeout(resolve, sec * 1000))
}
