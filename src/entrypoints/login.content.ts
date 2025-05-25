export default defineContentScript({
  matches: [
    'https://rajshaladarpan.rajasthan.gov.in/*/OfficeLoginNew.aspx',
    'https://rajshaladarpan.rajasthan.gov.in/*/stafflogin.aspx',
  ],
  main() {
    const captchaInput = document.querySelector<HTMLInputElement>(
      '#bodyContent_txt_Captchaname, #txt_Captchaname'
    )
    if (!captchaInput) return

    // Remove annoying alert message on blur for empty captcha input
    captchaInput.removeAttribute('onblur')
  },
})
