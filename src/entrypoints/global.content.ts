import '~/assets/tailwind.css'

import { ContentScriptContext } from 'wxt/utils/content-script-context'
import { createButton, getCurrentSdSegment, setFavicon, setFormElementValue } from '~/utils'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*'],
  main(ctx) {
    setFavicon('/SD1/Home/Public2/assets/img/home-icon.png')
    autoDetectTabTitle()

    const hasLoggedIn = location.href.toLowerCase().includes('school')
    if (hasLoggedIn) {
      const isBlankPage = document.body.children.length === 0
      if (isBlankPage) {
        handleBlankPages(ctx)
      } else {
        setSessionRefreshInterval(ctx)
        setGlobalDefaults()
      }
    }
    addGlobalStyles()
  },
})

function autoDetectTabTitle() {
  const title =
    // Get the title from the active breadcrumb or from the page title
    document.querySelector('ol.breadcrumb li.active, .box_heading h2')?.textContent?.trim()
    ?? location.pathname.split('/').at(-1)?.slice(0, -5) // Get the last pathname segment from url

  document.title = title ? `${title} | ShalaDarpan` : 'ShalaDarpan'
}

function handleBlankPages(ctx: ContentScriptContext) {
  // add popup login for session expired blank pages
  const p = document.body.appendChild(document.createElement('p'))
  p.className =
    'tw:p-8 tw:m-4 tw:bg-rose-100 tw:border tw:border-s-6 tw:text-rose-500 tw:border-s-rose-500 tw:border-rose-200 tw:rounded-sm'
  p.append(
    'Oops! Your session has been expired unexpectedly, please ',
    createButton({
      className:
        'tw:text-blue-600 tw:font-bold tw:hover:cursor-pointer tw:hover:underline tw:decoration-blue-400',
      children: 'Login',
      onClick: handlePopupLogin,
      signal: ctx.signal,
    }),
    ' again to continue!',
  )
}

function handlePopupLogin() {
  const popup = window.open(
    `${getCurrentSdSegment()}/Home/Public2/OfficeLoginNew.aspx`,
    'popup-login',
    'popup=1,toolbar=0,location=0,menubar=0,scrollbars=1,status=1,width=500,height=650',
  )
  if (!popup) return
  popup.focus()
  popup.addEventListener('DOMContentLoaded', () => {
    popup.document.querySelector('main')?.scrollIntoView()
  })

  const frc = () => {
    if (
      popup.document.readyState === 'loading'
      && popup.location.pathname.toLowerCase().includes('school')
    ) {
      cancelAnimationFrame(animationFrameId)
      popup.close()
      window.location.reload()
      return
    }

    animationFrameId = requestAnimationFrame(frc)
  }
  let animationFrameId = requestAnimationFrame(frc)
}

function setSessionRefreshInterval(ctx: ContentScriptContext) {
  let intervalId = 0
  const signalObj = { signal: ctx.signal }
  // refresh every 5 minutes to avoid session timeout
  const handleOnline = () => {
    intervalId = window.setInterval(
      () => {
        requestIdleCallback(
          () => fetch(`${getCurrentSdSegment()}/Home/School/Home_New.aspx`, signalObj),
          { timeout: 5 * 1000 }, // 5sec
        )
      },
      5 * 60 * 1000,
    ) // 5min
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
    },
  )
  setFormElementValue(
    formElements,
    [
      'ContentPlaceHolder1_ddlSection',
      'ctl00$ContentPlaceHolder1$ddlSection',
      'ctl00$ContentPlaceHolder1$footer2$ddlsection', // StudentAttendence
    ],
    '1', // A
  )
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlstream', '3') // Arts
  setFormElementValue(formElements, 'ctl00$ContentPlaceHolder1$ddlsubject', '0') // All
}

function addGlobalStyles() {
  // Align stars in a row
  document.querySelector('div:has(>#lblSchoolStar)')?.classList.add('tw:flex')

  // Prevent annoying login page always being opening in new tab
  document.querySelectorAll('.loginMenu .dropdown-item').forEach((a) => a.removeAttribute('target'))

  // Force dropdown menu links in single line, so it don't push others
  document.querySelectorAll<HTMLAnchorElement>('#ulmenu1 .padd').forEach((a) => {
    a.classList.add('tw:line-clamp-1')
    a.style.padding = '4px 0 4px 20px' // couldn't override the padding with classes
    a.textContent && (a.title = a.textContent.trim())
  })
}
