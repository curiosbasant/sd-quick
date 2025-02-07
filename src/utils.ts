import { google } from 'googleapis'

export const sheets = google.sheets('v4').spreadsheets
// https://docs.google.com/spreadsheets/d/1qsOV_3eSW2GpOLW00Om7o6vBPg87Y9CNhRJCQHrG6d4/edit
const SHEET_ID = '1qsOV_3eSW2GpOLW00Om7o6vBPg87Y9CNhRJCQHrG6d4'

export async function initializeGoogle() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      // private_key_id: 'f60d51a72aaf69209680e80455e2cd23fccce5aa',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbm1OKXgu6OjUq\n2YTD9KGDUw8uMCXRH4UzMpIDlNwUqm8hdhJQ0eqF1cSs9TdvU57epVbNdyLGLVlg\nmliVN+X8bJy7hnYU5ktg3b5eDPmIMjrSGWA2MAvXsTEyzFVTGgyup0X6BEZP8TOe\nQKn933pVSs/LGcutibxyYVecBVs5jgH73MGznMU5y86IoEhajgH7WKAW1WzeZYmk\ntvj2Yp7qUUDl1q1f9ejThSzIxCuDej24HhAMWwL4HXgybqtrlXXef+nYPFoInF5j\nEIF1akcZIjQ5YEp5FvLqLTazbNEYHgZZGYjdmLLPpQzksyvR4I28Kw4uq27go+sz\nuHYb1FchAgMBAAECggEAAV5p6zctkjtN2W0lalXeD9ossYLR6leFI/CncSmfj/z5\n0kkIGzblgbziKIVVsgCBzsKUk2UfZK/kb+GbsuBVgRVxgYLKyh9GfXkl4gzqKwUK\nGGwJuSBOEl0oKiK7A2qgvu6QwoTEG5LrGdLGzAlpuZNZZZd5/7JM+pKZozE23rg6\nEAl2vr+DmCRlZElGiwdN2RK2137yhJ1Nac3KFER/Of7LNgct2lB5DtxtQPiR0XF5\nIc/GBMKTwXudvhG7GrgZ/X5I1M4kBA3yWJncttGrfDVHS0T5OyB8gfadY4VxcVPb\nAc8+2slSPB2oJ5dfGgMUqVkDPNRhMHXBmfmsZhHZCwKBgQDMnnusXs6r7v6fMeeW\npZBuTYDuZw26W7iCGWZUri8mz04gFgsADLmIUD41E1GphbOLPTLPwgDPowpxCBWL\n9izjgzJeCmItHbOzq2ttfHnfl7YWF9uV1qxSUlnADAXbC1yH3Sc0YnzNLRtFtCcI\nksUvkipo+yVJahdeHlQB8975ywKBgQDCri+q4pEcVMwPSRp2gxoNLwk+lQIVuu3Z\niXLi3nsv8wmyissQWmsPUuGr0fIL3ayvsHhQtKl1P5glR3IiltfwAtAtZtfQBcqD\n1011XOdjV1d3zz+nfXaOoYp7QZC3+7/KkSY2RUy769skjcnGtkF61nEtJ0KkF1KS\n+b0ZdcgFQwKBgQCle361tq8aadzOzsNnGFsoedHN/NYjY05jGTujPIOxtXKPjIQ0\n9BWQYqUMs6UVnqXH9CSF1XZmdotZQpp6aQuArHgtieRAbIcKxZXKJCNEayO91mmm\nUslmgmdHY/HQZu3ci0TLnuMj5FjsFHiE/H4wrNtTr9lF+GERoyF5ussX5QKBgQCb\n8EhwWgEgL3Awwj63NTZV3xpJjbPY0h2ZBTcIMGt+Me/PmssjMznUUXBAX+/Av3SG\nWhVVmBCwwRrOqZbry+X181rrMxilIS5hQsFhw+P4N8rxRgnX0HB5uT2ikxcnuDid\nOnzgNcxMLpUfh49bYzu5+DE5mNwRcjkLT42/6g8o3wKBgHpJW3u2XkWa3jw18E6Y\nWfe7nyiRdcOAcocDceaeFOmKaH5PzS8Kn6sX6eio/pV6h5EztbkqdHYRiaW97g28\nLHBgEmk7EPIAgEsausBPoRNtsR0xlzZa5b9rmgD0OJwz8Tn88VnZUBny0/CnZLsc\nIknGBgciR6oBaeUnFTH0MvmQ\n-----END PRIVATE KEY-----\n',
      client_email: 'my-ideations@appspot.gserviceaccount.com',
      client_id: '104416254290850328694',
      // auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      // token_uri: 'https://oauth2.googleapis.com/token',
      // auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      // client_x509_cert_url:
      // 'https://www.googleapis.com/robot/v1/metadata/x509/my-ideations%40appspot.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  google.options({
    // @ts-expect-error
    auth: await auth.getClient(),
  })
}

export async function getSheetEpicNumbers() {
  const { data } = await sheets.values.get({
    spreadsheetId: SHEET_ID,
    majorDimension: 'COLUMNS',
    range: 'Sheet1!A:A',
  })

  return data.values?.[0].map((epic) => {
    const epicUpper = epic.toUpperCase()
    if (epicUpper.startsWith('RJ/24')) return epicUpper

    return epicUpper.replaceAll('/', '')
  })
}

export function updateSheetEpicDetails<R extends [string, ...any[]]>(
  rows: R[],
  epicList: string[]
) {
  const epicToRowMap = rows.reduce<Record<string, R>>((acc, row) => ((acc[row[0]] = row), acc), {})

  return sheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Sheet1!B1:ZZ${epicList.length}`,
    valueInputOption: 'RAW', // RAW or USER_ENTERED based on your data
    requestBody: {
      values: epicList.map((epic, index) => {
        const row = epicToRowMap[epic]
        return row ? row : rows[index] ? ['EPIC_NOT_FOUND'] : [...rows[index], 'EPIC_CHANGED']
      }),
    },
  })
}

export async function dispatchAction(action: string, payload?: any) {
  const [tab] = await chrome.tabs.query({ active: true })
  await chrome.tabs.sendMessage(tab.id!, { action, payload })
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
