import type { ContentScriptDefinition } from 'wxt'
import { processInParallel } from '~/utils/general'
import { makeSdRequest, makeSdCachedRequest } from '~/utils/request'

declare global {
  interface Window {
    makeSdRequest: typeof makeSdRequest
    makeSdCachedRequest: typeof makeSdCachedRequest
    processInParallel: typeof processInParallel
    timeInSecondsAfterSessionOut: number
  }
}

export default {
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*'],
  world: 'MAIN',
  main() {
    // Expose utility functions
    window.makeSdRequest = makeSdRequest
    window.makeSdCachedRequest = makeSdCachedRequest
    window.processInParallel = processInParallel
    // Infinite session timeout
    window.timeInSecondsAfterSessionOut = Infinity
  },
} satisfies ContentScriptDefinition
