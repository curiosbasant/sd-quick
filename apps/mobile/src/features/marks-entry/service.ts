import { Params, ShaladarpanStudent } from './types'

export function getShaladarpanClassStudents(params: Params) {
  const url = new URL('/sheet', 'http://192.168.29.91:8081')
  Object.entries(params).forEach((v) => url.searchParams.set(...v))
  console.log(`fetching ${url}`)
  return fetch(url).then<ShaladarpanStudent[]>((res) => res.json())
}

export function addMarks(params: Params & { srNo: string; marks: string }) {
  const url = new URL('/sheet', 'http://192.168.29.91:8081')
  return fetch(url, { method: 'POST', body: JSON.stringify(params) })
}
