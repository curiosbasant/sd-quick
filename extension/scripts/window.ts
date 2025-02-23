export {}

declare global {
  interface Window {
    timeInSecondsAfterSessionOut: number
  }
}

window.timeInSecondsAfterSessionOut = Infinity

// refresh every 5 minutes to avoid session timeout
setInterval(() => {
  fetch(`${location.origin + location.pathname.slice(0, 4)}/Home/School/Home_New.aspx`)
}, 5 * 60 * 1000)
