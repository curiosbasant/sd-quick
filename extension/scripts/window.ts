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

// Set the window title
document.title = (() => {
  const title =
    // Get the title from the active breadcrumb or from the page title
    document.querySelector('ol.breadcrumb li.active, .box_heading h2')?.textContent?.trim() ??
    // Get the last pathname segment
    location.pathname.split('/').at(-1)?.slice(0, -5)

  return title ? `${title} | ShalaDarpan` : 'ShalaDarpan'
})()
