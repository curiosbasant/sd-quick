// This script only works in main world

// Remove annoying alert message for input captcha on blur
document
  .querySelector<HTMLInputElement>('#bodyContent_txt_Captchaname, #txt_Captchaname')
  ?.removeAttribute('onblur')
