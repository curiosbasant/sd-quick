import { makeSdRequest, randomBetween } from '~/utils'

export default defineContentScript({
  matches: ['https://rajshaladarpan.rajasthan.gov.in/*/StudentDailypresence.aspx'],
  world: 'MAIN',
  main() {
    // Remove annoying network validation from input fields.
    document.querySelectorAll('#ContentPlaceHolder1_grdAttendence tr:has(input)').forEach((tr) => {
      const maxBoys = tr.children[1].textContent?.trim()
      const maxGirls = tr.children[2].textContent?.trim()

      const boyInput = tr.children[7].firstElementChild as HTMLInputElement
      boyInput.type = 'number'
      boyInput.removeAttribute('onchange')
      boyInput.removeAttribute('onkeypress')
      boyInput.tabIndex = 1
      boyInput.min = '0'
      maxBoys && (boyInput.max = maxBoys)

      const girlInput = tr.children[8].firstElementChild as HTMLInputElement
      girlInput.type = 'number'
      girlInput.removeAttribute('onchange')
      girlInput.removeAttribute('onkeypress')
      girlInput.tabIndex = 1
      girlInput.min = '0'
      maxGirls && (girlInput.max = maxGirls)
      girlInput.addEventListener('blur', handleInputBlur)

      const totalInput = tr.children[9].firstElementChild as HTMLInputElement
      totalInput.readOnly = true
      totalInput.removeAttribute('onchange')
    })

    document.getElementById('ContentPlaceHolder1_btn_Save')!.tabIndex = 1
  },
})

async function handleInputBlur(ev: FocusEvent) {
  const input = ev.currentTarget as HTMLInputElement
  const editBtn = input.parentElement?.nextElementSibling?.nextElementSibling
    ?.firstElementChild as HTMLInputElement
  if (!editBtn) return

  const tempDiv = input.parentElement!.appendChild(document.createElement('div'))
  // This is to put extra required fields
  tempDiv.innerHTML = `
    <input name="ctl00$ScriptManager1" value="ctl00$ContentPlaceHolder1$UpdatePanel4|${
      editBtn.name
    }" type="hidden" readonly>
    <input name="${editBtn.name}.x" value="${randomBetween(2, 20)}" readonly type="hidden">
    <input name="${editBtn.name}.y" value="${randomBetween(2, 20)}" readonly type="hidden">
  `

  const promise = makeSdRequest()
  // Remove immediately after making the request, so to avoid polluting subsequent requests
  tempDiv.remove()
  const res = await promise
  // Set tr backgroundColor
  input.parentElement!.parentElement!.style.backgroundColor = res.ok ? 'green' : 'red'

  // Calculate and set total
  const boyInput = input.parentElement?.previousElementSibling
    ?.firstElementChild as HTMLInputElement
  const totalInput = input.parentElement?.nextElementSibling?.firstElementChild as HTMLInputElement
  boyInput && totalInput && (totalInput.value = String(+boyInput.value + +input.value))
}
