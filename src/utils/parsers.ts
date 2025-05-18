export function parseHtmlString(text: string) {
  return new DOMParser().parseFromString(text, 'text/html')
}
