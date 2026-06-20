export interface FormatMoneyOptions {
  currency?: 'UAH' | 'грн.' | null
  showPlus?: boolean
  spacedSign?: boolean
}

export function parseMoneyToCents(input: string): number {
  const normalized = input.trim().replace(/[\s\u00A0\u202F]/g, '')

  if (!/^-?\d+(?:[.,]\d{1,2})?$/.test(normalized)) {
    return Number.NaN
  }

  const sign = normalized.startsWith('-') ? -1 : 1
  const unsigned = normalized.replace(/^-/, '').replace(',', '.')
  const [majorPart, decimalPart = ''] = unsigned.split('.')
  const minorPart = decimalPart.padEnd(2, '0')
  const cents = Number(majorPart) * 100 + Number(minorPart)

  return Number.isSafeInteger(cents) ? cents * sign : Number.NaN
}

export function formatMoney(
  cents: number,
  { currency = 'грн.', showPlus = false, spacedSign = false }: FormatMoneyOptions = {},
): string {
  const safeCents = Number.isFinite(cents) ? Math.round(cents) : 0
  const absoluteCents = Math.abs(safeCents)
  const major = Math.floor(absoluteCents / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const minor = (absoluteCents % 100).toString().padStart(2, '0')
  const sign = safeCents < 0 ? '-' : showPlus && safeCents > 0 ? '+' : ''
  const signText = sign && spacedSign ? `${sign} ` : sign
  const amount = `${signText}${major}.${minor}`

  return currency ? `${amount} ${currency}` : amount
}
