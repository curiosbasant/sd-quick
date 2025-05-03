import { randomBetween, setFormElementValue } from '../utils'

const favs: Record<string, string[]> = {
  ctl00$ContentPlaceHolder1$txtkhel: [
    'कबड्डी',
    'खो-खो',
    'लंगड़ी टांग',
    'चोर-सिपाही',
    'सांप-सीढ़ी',
    'लुका-छिपी',
    'कंचे',
    'गिल्ली डंडा',
    'पकड़ा-पकड़ी',
    'गेंद पकड़ो',
  ],
  ctl00$ContentPlaceHolder1$txtgeet: [
    'नानी तेरी मोरनी',
    'लकड़ी की काठी',
    'चंदा मामा दूर के',
    'ट्विंकल ट्विंकल लिटिल स्टार',
    'झूले झूले लाली',
    'अक्कड़ बक्कड़ बंबे बो',
    'एक बिल्ली चली चूहों की शादी में',
    'आलू कचालू बेटा कहाँ गए थे',
    'रेल गाड़ी रेल गाड़ी',
    'बंदर मामा पहन पजामा',
  ],
  ctl00$ContentPlaceHolder1$txtphal: [
    'सेब',
    'केला',
    'आम',
    'अंगूर',
    'संतरा',
    'अनार',
    'अमरूद',
    'पपीता',
    'तरबूज',
    'लीची',
  ],
  ctl00$ContentPlaceHolder1$txtsweets: [
    'लड्डू',
    'बर्फी',
    'रसगुल्ला',
    'गुलाब जामुन',
    'जलेबी',
    'खीर',
    'हलवा',
    'पेडा',
    'चमचम',
    'बालूशाही',
  ],
  ctl00$ContentPlaceHolder1$txtfestival: [
    'दिवाली',
    'होली',
    'रक्षाबंधन',
    'दशहरा',
    'जन्माष्टमी',
    'ईद',
    'गणेश चतुर्थी',
    'मकर संक्रांति',
    'बैसाखी',
    'क्रिसमस',
  ],
  ctl00$ContentPlaceHolder1$txtpashu: [
    'गाय',
    'बकरी',
    'कुत्ता',
    'बिल्ली',
    'शेर',
    'हाथी',
    'बंदर',
    'भालू',
    'ऊँट',
    'घोड़ा',
  ],
  ctl00$ContentPlaceHolder1$txtpakshi: [
    'कबूतर',
    'तोता',
    'मैना',
    'मोर',
    'कौवा',
    'उल्लू',
    'बतख',
    'हंस',
    'बाज',
  ],
}

const heightWeight = [
  {
    age_range_years: '6-7',
    height_cm: [108, 118],
    weight_kg: [18, 22],
  },
  {
    age_range_years: '7-8',
    height_cm: [113, 123],
    weight_kg: [20, 25],
  },
  {
    age_range_years: '8-9',
    height_cm: [118, 128],
    weight_kg: [22, 28],
  },
  {
    age_range_years: '9-10',
    height_cm: [122, 132],
    weight_kg: [24, 32],
  },
] satisfies {
  age_range_years: string
  height_cm: [number, number]
  weight_kg: [number, number]
}[]

const autoFillButton = document.createElement('button')
autoFillButton.type = 'button'
autoFillButton.textContent = 'Auto Fill'
autoFillButton.classList.add('btn', 'btn-primary')
autoFillButton.addEventListener('click', () => {
  // Randomly check all radios
  document.querySelectorAll('#ContentPlaceHolder1_div4 .MyClass table tr').forEach((tr) => {
    const input = tr.children[randomBetween(0, tr.childElementCount - 1)]
      .firstElementChild as HTMLInputElement
    if (input) {
      input.checked = true
    }
  })

  const formElements = document.querySelector<HTMLFormElement>('#form1')?.elements
  if (!formElements) return alert('form1 not found')

  const selectedValue = document.querySelector<HTMLSelectElement>('#ContentPlaceHolder1_ddlsa')
    ?.selectedOptions[0]?.value
  if (!selectedValue) return alert('ddlsa not found')

  const classHeightWeight = heightWeight[0]
  const classAverageHeight = Math.round(
    (classHeightWeight.height_cm[0] + classHeightWeight.height_cm[1]) / 2
  )
  if (selectedValue === '01') {
    // सह-शैक्षिक गतिविधियां आकलन विवरण (SA-1)
    // session start height in cm
    setFormElementValue(
      formElements,
      'ctl00$ContentPlaceHolder1$txtstartlength',
      randomBetween(classHeightWeight.height_cm[0], classAverageHeight).toString()
    )
    // session start weight in kg
    setFormElementValue(
      formElements,
      'ctl00$ContentPlaceHolder1$txtstartweight',
      randomBetween(...classHeightWeight.weight_kg).toString()
    )
    return
  }

  if (selectedValue === '03') {
    // session end height in cm
    setFormElementValue(
      formElements,
      'ctl00$ContentPlaceHolder1$txtendlength',
      randomBetween(classAverageHeight, classHeightWeight.height_cm[1]).toString()
    )
    // session end weight in kg
    setFormElementValue(
      formElements,
      'ctl00$ContentPlaceHolder1$txtendweight',
      randomBetween(...classHeightWeight.weight_kg).toString()
    )

    setFormElementValue(
      formElements,
      [
        'ctl00$ContentPlaceHolder1$rbtndrashti', // vision: normal
        'ctl00$ContentPlaceHolder1$rbtnsharvan', // hearing correct
        'ctl00$ContentPlaceHolder1$ddlregulatippni', // regularity
      ],
      '1'
    )
    setFormElementValue<HTMLSelectElement>(
      formElements,
      [
        'ctl00$ContentPlaceHolder1$ddlbloodgroup', // blood group
        'ctl00$ContentPlaceHolder1$ddlcolor', // fav color
      ],
      (elem) => randomBetween(1, elem.options.length - 1).toString()
    )

    // set random favorites
    setFormElementValue<HTMLInputElement>(
      formElements,
      Object.keys(favs),
      (elem) => favs[elem.name][randomBetween(0, favs[elem.name].length - 1)]
    )

    const feedbackCheckboxes = document.querySelectorAll<HTMLInputElement>(
      '#ContentPlaceHolder1_ddlsafeedback input[type="checkbox"]'
    )
    if (feedbackCheckboxes.length > 0) {
      // randomly check 4-5 checkboxes
      feedbackCheckboxes.forEach((inp) => (inp.checked = false))
      for (const _ of Array(randomBetween(4, 5))) {
        const r = randomBetween(0, feedbackCheckboxes.length - 1)
        feedbackCheckboxes[r].checked = true
      }
    }

    return
  }

  const entryRows = document.querySelectorAll(
    '#ContentPlaceHolder1_grdItemEntry tr:has(input[type="text"])'
  )
  if (entryRows.length === 0) return

  const classValue = parseInt(
    document.querySelector('#ContentPlaceHolder1_lblheading :nth-child(3)')?.textContent || '0'
  )
  const grade = (
    (entryRows[0].children[3].firstElementChild as HTMLInputElement)?.value ||
    prompt('Enter grade') ||
    ''
  ).toUpperCase()
  entryRows.forEach((tr) => {
    const classLevelInput = tr.children[2].firstElementChild as HTMLInputElement
    if (classLevelInput) {
      classLevelInput.value = classValue.toString()
    }

    const gradeInput = tr.children[3].firstElementChild as HTMLInputElement
    if (gradeInput) {
      gradeInput.value = grade
    }
  })
})

const baselineButton = document.createElement('button')
baselineButton.type = 'button'
baselineButton.textContent = 'Set Baseline'
baselineButton.classList.add('btn', 'btn-primary')
baselineButton.addEventListener('click', () => {
  const classValue = parseInt(
    document.querySelector('#ContentPlaceHolder1_lblheading :nth-child(3)')?.textContent || '0'
  )
  document
    .querySelectorAll<HTMLInputElement>('#ContentPlaceHolder1_divPlusMinus input[type=text]')
    .forEach((inp) => (inp.value = classValue.toString()))
})

document.querySelector('#div2')?.append(baselineButton, autoFillButton)
// ctl00$ContentPlaceHolder1$grdItemEntry$ctl04$ddlClassLevel1
// ctl00$ContentPlaceHolder1$grdItemEntry$ctl05$ddlClassLevel1
//
// ctl00$ContentPlaceHolder1$grdItemEntry$ctl04$ddlGrade1
// ctl00$ContentPlaceHolder1$grdItemEntry$ctl05$ddlGrade1
