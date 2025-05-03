export function parseHtmlString(text: string) {
  return new DOMParser().parseFromString(text, 'text/html')
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

export async function readFromClipboard() {
  try {
    return await navigator.clipboard.readText()
  } catch {
    throw new Error('Please, keep your mouse focus on the page and then try again!')
  }
}

export async function copyToClipboard(content: string) {
  try {
    await navigator.clipboard.writeText(content)
  } catch {
    throw new Error('Please, keep your mouse focus on the page and then try again!')
  }
}
