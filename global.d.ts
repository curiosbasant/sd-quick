declare global {
  declare const form1: HTMLFormElement | undefined
  type HTMLFormControlElement = HTMLSelectElement | HTMLInputElement

  interface HTMLFormControlsCollection {
    [P: string | number]: HTMLFormControlElement
  }
}

export {}
