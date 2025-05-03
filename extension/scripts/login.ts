// @ts-nocheck This script only works in main world

// Remove annoying alert message for input captcha on blur
document
  .querySelector<HTMLInputElement>('#bodyContent_txt_Captchaname, #txt_Captchaname')
  ?.removeAttribute('onblur')

declare function SHA512(arg: string): string
declare function MD5(arg: string): string

window.sha512auth_New1 = () => {
  const elem = document.querySelector<HTMLInputElement>('#bodyContent_txtUName')
  const username = elem?.value.trim() ?? ''
  if (username.length === 0 || username.length > 15) {
    alert('Please enter valid username1')
    elem.value = ''
    elem?.focus()
    return -1
  }

  const password = document.querySelector<HTMLInputElement>('#bodyContent_txtUPswd')?.value.trim()
  if (!password) return -10

  document.querySelector('#bodyContent_hdnLoginid').value = username
  document.querySelector('#bodyContent_hdntxtop').value = SHA512(MD5(username + password))

  const msg = document.querySelector('#bodyContent_hdnfld').value
  document.querySelector('#bodyContent_txtUPswd').value = SHA512(
    msg + SHA512(username.toLowerCase() + password)
  )

  const lop = SHA512(password)
  document.querySelector('#bodyContent_hdntxtUPswdname').value = lop
  document.querySelector('#bodyContent_hdntxtUPswdname1').value = SHA512(msg + lop)
}
