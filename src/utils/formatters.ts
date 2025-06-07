const rules = new Intl.PluralRules(undefined, { type: 'ordinal' })
const suffixes = new Map([
  ['one', 'st'],
  ['two', 'nd'],
  ['few', 'rd'],
  ['other', 'th'],
])
export const formatOrdinal = (num: number) => num + suffixes.get(rules.select(num))!
