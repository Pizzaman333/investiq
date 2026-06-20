import { describe, expect, it } from 'vitest'
import { formatDateForDisplay, getMonthKey, getPeriodInfo, shiftMonthKey } from './dates'

describe('date utilities', () => {
  it('converts ISO dates for storage and display', () => {
    expect(getMonthKey('2019-11-21')).toBe('2019-11')
    expect(formatDateForDisplay('2019-11-21')).toBe('21.11.2019')
  })

  it('describes and shifts periods across years', () => {
    expect(getPeriodInfo('2019-11')).toEqual({ monthKey: '2019-11', month: 'ЛИСТОПАД', year: '2019' })
    expect(shiftMonthKey('2019-12', 1)).toBe('2020-01')
    expect(shiftMonthKey('2020-01', -1)).toBe('2019-12')
  })
})
