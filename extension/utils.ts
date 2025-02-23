export function setFormElementValue<T extends HTMLInputElement | HTMLSelectElement | RadioNodeList>(
  elements: HTMLFormControlsCollection,
  name: string,
  value: string | ((elem: T) => string)
) {
  const elem = elements.namedItem(name) as T | null
  elem && (elem.value = typeof value === 'function' ? value(elem) : value)
}
