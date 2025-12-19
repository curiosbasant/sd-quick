import { ContentScriptDefinition } from 'wxt'
import { makeSdRequest } from '~/utils/request'

declare global {
  interface Window {
    makeSdRequest: typeof makeSdRequest
    timeInSecondsAfterSessionOut: number
    StartThisSessionTimer: () => void
  }
}

export default {
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*'],
  world: 'MAIN',
  main() {
    // Expose utility functions
    window.makeSdRequest = makeSdRequest
  },
} satisfies ContentScriptDefinition
