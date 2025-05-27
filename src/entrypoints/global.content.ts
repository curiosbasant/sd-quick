import '~/assets/tailwind.css'

import { ContentScriptContext } from 'wxt/utils/content-script-context'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*'],
  main(ctx) {
    setSessionRefreshInterval(ctx)
    setGlobalDefaults()
    setFavicon('/SD1/Home/Public2/assets/img/home-icon.png')
    autoDetectTabTitle()

    // add popup login for session expired blank pages
    if (document.body.children.length === 0) {
      const p = document.body.appendChild(document.createElement('p'))
      p.append(
        'Oops! Your session has expired unexpectedly, please ',
        createButton({ children: 'Login', onClick: handlePopupLogin }),
        ' again to continue!'
      )
    }

    // Prevent annoying login page always being opening in new tab
    document
      .querySelectorAll('.loginMenu .dropdown-item')
      .forEach((a) => a.removeAttribute('target'))

    // Force dropdown menu links in single line, so it don't push others
    document.querySelectorAll<HTMLAnchorElement>('#ulmenu1 .padd').forEach((a) => {
      a.style.display = '-webkit-box'
      a.style.webkitBoxOrient = 'vertical'
      a.style.webkitLineClamp = '1'
      a.style.overflow = 'hidden'
      a.style.padding = '3px 0 3px 20px'

      a.textContent && (a.title = a.textContent.trim())
    })
  },
})

function setSessionRefreshInterval(ctx: ContentScriptContext) {
  let intervalId = 0
  const signalObj = { signal: ctx.signal }
  // refresh every 5 minutes to avoid session timeout
  const handleOnline = () => {
    intervalId = window.setInterval(() => {
      requestIdleCallback(
        () => fetch(`${getCurrentSdSegment()}/Home/School/Home_New.aspx`, signalObj),
        { timeout: 5 * 1000 } // 5sec
      )
    }, 5 * 60 * 1000) // 5min
  }
  const handleOffline = () => {
    clearInterval(intervalId)
  }

  if (navigator.onLine) handleOnline()
  ctx.onInvalidated(handleOffline)
  addEventListener('online', handleOnline, signalObj)
  addEventListener('offline', handleOffline, signalObj)
}

function setGlobalDefaults() {
  const formElements = document.querySelector<HTMLFormElement>('#form1')?.elements
  if (!formElements) return

  setFormElementValue<HTMLSelectElement>(
    formElements,
    [
      'ctl00$ContentPlaceHolder1$ddlSession',
      'ctl00$ContentPlaceHolder1$ctl00$ddlSession', // RMSA_MonthlySessionsEntry
      'ctl00$ContentPlaceHolder1$footer2$ddlsession', // StudentAttendence
    ],
    (select) => {
      const lastOption = select.lastElementChild // Get the current session
      return lastOption && 'value' in lastOption ? (lastOption.value as string) : ''
    }
  )
  setFormElementValue(
    formElements,
    [
      'ContentPlaceHolder1_ddlSection',
      'ctl00$ContentPlaceHolder1$ddlSection',
      'ctl00$ContentPlaceHolder1$footer2$ddlsection', // StudentAttendence
    ],
    '1' // A
  )
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlstream', '3') // Arts
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlsubject', '0') // All
}

function autoDetectTabTitle() {
  const title =
    // Get the title from the active breadcrumb or from the page title
    document.querySelector('ol.breadcrumb li.active, .box_heading h2')?.textContent?.trim() ??
    // Get the last pathname segment from url
    location.pathname.split('/').at(-1)?.slice(0, -5)

  document.title = title ? `${title} | ShalaDarpan` : 'ShalaDarpan'
}

function handlePopupLogin() {
  const popup = window.open(
    `${location.pathname.slice(0, 4)}/Home/Public2/OfficeLoginNew.aspx`,
    'popup-login',
    'popup=1,toolbar=0,location=0,menubar=0,scrollbars=1,status=1,width=500,height=650'
  )
  if (!popup) return
  popup.focus()
  popup.addEventListener('DOMContentLoaded', () => {
    popup.document.querySelector('main')?.scrollIntoView()
  })
  const frc = () => {
    if (
      popup.document.readyState === 'loading' &&
      popup.location.pathname.toLowerCase().includes('school')
    ) {
      console.log('ho gya login')
      cancelAnimationFrame(animationFrameId)
      popup.close()
      window.location.reload()
      return
    }

    animationFrameId = requestAnimationFrame(frc)
  }
  let animationFrameId = requestAnimationFrame(frc)
}
