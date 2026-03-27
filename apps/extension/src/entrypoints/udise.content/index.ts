import type { ContentScriptDefinition } from 'wxt'

import { handleProfileUpdate } from './profile-update'

export default {
  matches: ['https://sdms.udiseplus.gov.in/*'],
  main(ctx) {
    checkUrlHash(location.hash)

    ctx.addEventListener(window, 'wxt:locationchange', ({ newUrl }) => {
      checkUrlHash(newUrl.hash)
    })
  },
} satisfies ContentScriptDefinition

function checkUrlHash(hash: string) {
  if (/#\/school\/(\d+)\/viewStudentDetails\/cy\/(\d+)/.test(hash)) {
    handleProfileUpdate()
  }
}
