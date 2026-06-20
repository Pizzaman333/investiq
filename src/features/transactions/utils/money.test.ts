import { describe, expect, it } from 'vitest'
import { formatMoney, parseMoneyToCents } from './money'

describe('parseMoneyToCents', () => {
  it.each([
    ['30', 3000],
    ['30.00', 3000],
    ['30,00', 3000],
    ['1 500,50', 150050],
    ['1500.50', 150050],
    ['-1 500,50', -150050],
  ])('parses %s', (input, expected) => {
    expect(parseMoneyToCents(input)).toBe(expected)
  })

  it('rejects malformed values', () => {
    expect(Number.isNaN(parseMoneyToCents('12.345'))).toBe(true)
    expect(Number.isNaN(parseMoneyToCents('hello'))).toBe(true)
  })
})

describe('formatMoney', () => {
  it('formats signs, grouping, and currency', () => {
    expect(formatMoney(5500000, { currency: 'UAH' })).toBe('55 000.00 UAH')
    expect(formatMoney(-150000, { currency: 'UAH' })).toBe('-1 500.00 UAH')
    expect(formatMoney(2000000, { currency: 'грн.', showPlus: true })).toBe('+20 000.00 грн.')
  })
})
