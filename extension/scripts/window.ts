export {}

declare global {
  interface Window {
    timeInSecondsAfterSessionOut: number
  }
}

window.timeInSecondsAfterSessionOut = Infinity

// refresh every 5 minutes to avoid session timeout
setInterval(() => {
  const sdNum = location.pathname.slice(0, 4) // /SD{1-4}
  fetch(`${location.origin + sdNum}/Home/School/Home_New.aspx`)
}, 5 * 60 * 1000)
