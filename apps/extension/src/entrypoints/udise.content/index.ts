import type { ContentScriptDefinition } from 'wxt'
import { handleClassListPage } from './handle-class-list'

export default {
  matches: ['https://sdms.udiseplus.gov.in/*'],
  main(ctx) {
    checkUrlHash(location.hash)

    ctx.addEventListener(window, 'wxt:locationchange', ({ oldUrl, newUrl }) => {
      checkUrlHash(newUrl.hash)
    })
  },
} satisfies ContentScriptDefinition

function checkUrlHash(hash: string) {
  if (/#\/school\/(\d+)\/viewStudentDetails\/cy\/(\d+)/.test(hash)) {
    console.log('handleClassListPage called')
    handleClassListPage()
  }
}
