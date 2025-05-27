export default defineContentScript({
  matches: [
    'https://rajshaladarpan.rajasthan.gov.in/*/OfficeLoginNew.aspx',
    'https://rajshaladarpan.rajasthan.gov.in/*/stafflogin.aspx',
  ],
  main() {
    // Fix, login card size on medium screens
    const cardContainer = document.querySelector('div:has(>.card)')
    if (cardContainer) {
      cardContainer.removeAttribute('class')
      cardContainer.setAttribute('style', 'max-width:32rem')
    }

    // Fix, make captcha a bit bigger
    document
      .querySelector('#bodyContent_Img2, #Img2')
      ?.setAttribute('style', 'width:75%;margin:auto')

    const captchaInput = document.querySelector<HTMLInputElement>(
      '#bodyContent_txt_Captchaname, #txt_Captchaname'
    )
    if (captchaInput) {
    // Remove annoying alert message on blur for empty captcha input
    captchaInput.removeAttribute('onblur')
    }
  },
})
