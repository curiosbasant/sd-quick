export default defineContentScript({
  matches: [
    'https://rajshaladarpan.rajasthan.gov.in/*/OfficeLoginNew.aspx',
    'https://rajshaladarpan.rajasthan.gov.in/*/stafflogin.aspx',
  ],
  world: 'MAIN',
  async main() {
    // This script only works in main world

    const captchaInput = document.querySelector<HTMLInputElement>(
      '#bodyContent_txt_Captchaname, #txt_Captchaname'
    )
    if (!captchaInput) return

    // Remove annoying alert message for input captcha on blur
    captchaInput.removeAttribute('onblur')

    const img = document.querySelector<HTMLImageElement>('#bodyContent_Img2')
    const base64 = img && imageToBase64(img)
    console.log({ img, base64 })
    if (base64) {
      const result = await fetch('http://127.0.0.1:5328/api/solve-captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: base64,
      }).then((res) => res.text())
      // Set the base64 image to the input field
      captchaInput.value = result
      console.log(result)
    }
  },
})

function imageToBase64(img: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  canvas.width = img.naturalWidth
  canvas.height = img.naturalHeight
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL()
}
