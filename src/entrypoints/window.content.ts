import { makeSdRequest } from '~/utils/request'

declare global {
  interface Window {
    makeSdRequest: typeof makeSdRequest
    timeInSecondsAfterSessionOut: number
    StartThisSessionTimer: () => void
  }
}

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*'],
  world: 'MAIN',
  main() {
    // Expose utility functions
    window.makeSdRequest = makeSdRequest
    // Infinite session timeout
    window.timeInSecondsAfterSessionOut = Infinity
    // Optional, just to avoid creating unnecessary timeouts
    window.StartThisSessionTimer = () => {}
  },
})
