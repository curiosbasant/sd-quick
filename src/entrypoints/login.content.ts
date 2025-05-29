export default defineContentScript({
  matches: [
    'https://rajshaladarpan.rajasthan.gov.in/*/OfficeLoginNew.aspx',
    'https://rajshaladarpan.rajasthan.gov.in/*/stafflogin.aspx',
  ],
  main() {
    // Fix, login card size on medium screens
    const cardContainer = document.querySelector('div:has(>.card)')
    if (cardContainer) {
      cardContainer.className = 'tw:max-w-lg'
    }

    // Fix, make captcha a bit bigger
    const captchaImg = document.querySelector('#bodyContent_Img2, #Img2')
    captchaImg && (captchaImg.className = 'tw:w-3/4 tw:m-auto')

    const captchaInput = document.querySelector<HTMLInputElement>(
      '#bodyContent_txt_Captchaname, #txt_Captchaname'
    )
    if (captchaInput) {
    // Remove annoying alert message on blur for empty captcha input
    captchaInput.removeAttribute('onblur')
    }
  },
})
