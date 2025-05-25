import { createWorker, PSM } from 'tesseract.js'

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

    const img = document.querySelector<HTMLImageElement>('#bodyContent_Img2')
    if (img) {
      const readCaptcha = async (img: HTMLImageElement) => {
        captchaInput.value = ''
        const { text } = await ocrImage(img)
        captchaInput.value = text.trim().replace(/ +/g, '')
      }
      readCaptcha(img)
      img.addEventListener('load', async (ev) => readCaptcha(ev.currentTarget as HTMLImageElement))
    }
  },
})

async function ocrImage(img: HTMLImageElement) {
  const worker = await createWorker('eng')
  await worker.setParameters({
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    tessedit_pageseg_mode: PSM.SINGLE_WORD,
  })
  const { data } = await worker.recognize(img)
  await worker.terminate()
  return data
}
