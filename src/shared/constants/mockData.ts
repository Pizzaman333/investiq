import type { PeriodInfo, ReportBarItem, ReportCategory } from '../types/report'
import type { SummaryItem, TransactionItem, TransactionKind } from '../types/transaction'

export interface TransactionFormValues {
  date: string
  description: string
  category: string
  amount: string
}

export interface LoginFormValues {
  email: string
  password: string
}

export const balanceAmount = '55 000.00 UAH'

export const loginInitialValues: LoginFormValues = {
  email: '',
  password: '',
}

export const transactionInitialValues: Record<TransactionKind, TransactionFormValues> = {
  expense: {
    date: '21.11.2019',
    description: '',
    category: '',
    amount: '0,00',
  },
  income: {
    date: '21.11.2019',
    description: '',
    category: '',
    amount: '0,00',
  },
}

export const expenseCategories = [
  'Транспорт',
  'Продукти',
  "Здоров'я",
  'Алкоголь',
  'Розваги',
  'Все для дому',
  'Техніка',
  "Комуналка, зв'язок",
  'Спорт, хобі',
  'Навчання',
  'Інше',
]

export const incomeCategories = ['ЗП', 'Дод. дохід', 'Подарунок', 'Фріланс']

export const transactionsByKind: Record<TransactionKind, TransactionItem[]> = {
  expense: [
    {
      id: 'expense-1',
      date: '05.09.2019',
      description: 'Метро',
      category: 'Транспорт',
      amount: '- 30.00 грн.',
      kind: 'expense',
    },
    {
      id: 'expense-2',
      date: '05.09.2019',
      description: 'Банани',
      category: 'Продукти',
      amount: '- 50.00 грн.',
      kind: 'expense',
    },
  ],
  income: [
    {
      id: 'income-1',
      date: '05.09.2019',
      description: 'Моя зп',
      category: 'ЗП',
      amount: '20 000.00 грн.',
      kind: 'income',
    },
    {
      id: 'income-2',
      date: '05.09.2019',
      description: '% на залишок на карті',
      category: 'Дод. прибуток',
      amount: '500.00 грн.',
      kind: 'income',
    },
  ],
}

export const summaryByKind: Record<TransactionKind, SummaryItem[]> = {
  expense: [
    { id: 'm11', label: 'ЛИСТОПАД', amount: '10 000.00' },
    { id: 'm10', label: 'ЖОВТЕНЬ', amount: '30 000.00' },
    { id: 'm09', label: 'ВЕРЕСЕНЬ', amount: '30 000.00' },
    { id: 'm08', label: 'СЕРПЕНЬ', amount: '20 000.00' },
    { id: 'm07', label: 'ЛИПЕНЬ', amount: '15 000.00' },
    { id: 'm06', label: 'ЧЕРВЕНЬ', amount: '18 000.00' },
  ],
  income: [
    { id: 'm11i', label: 'ЛИСТОПАД', amount: '25 500.00' },
    { id: 'm10i', label: 'ЖОВТЕНЬ', amount: '25 500.00' },
    { id: 'm09i', label: 'ВЕРЕСЕНЬ', amount: '25 500.00' },
    { id: 'm08i', label: 'СЕРПЕНЬ', amount: '20 000.00' },
    { id: 'm07i', label: 'ЛИПЕНЬ', amount: '20 000.00' },
    { id: 'm06i', label: 'ЧЕРВЕНЬ', amount: '18 000.00' },
  ],
}

export const reportPeriod: PeriodInfo = {
  month: 'ЛИСТОПАД',
  year: '2019',
}

export const reportTotals = {
  expense: '- 18 000.00 грн.',
  income: '+ 45 000.00 грн.',
}

export const reportCategoriesByKind: Record<TransactionKind, ReportCategory[]> = {
  expense: [
    { id: 'rc1', label: 'ПРОДУКТИ', amount: '5 000.00', kind: 'expense', icon: 'products' },
    { id: 'rc2', label: 'АЛКОГОЛЬ', amount: '200.00', kind: 'expense', icon: 'alcohol' },
    { id: 'rc3', label: 'РОЗВАГИ', amount: '800.00', kind: 'expense', icon: 'fun' },
    { id: 'rc4', label: "ЗДОРОВ'Я", amount: '900.00', kind: 'expense', icon: 'health' },
    { id: 'rc5', label: 'ТРАНСПОРТ', amount: '2 000.00', kind: 'expense', icon: 'transport' },
    { id: 'rc6', label: 'ВСЕ ДЛЯ ДОМУ', amount: '1 500.00', kind: 'expense', icon: 'home' },
    { id: 'rc7', label: 'ТЕХНІКА', amount: '800.00', kind: 'expense', icon: 'tech' },
    { id: 'rc8', label: "КОМУНАЛКА, ЗВ'ЯЗОК", amount: '2 200.00', kind: 'expense', icon: 'utilities' },
    { id: 'rc9', label: 'СПОРТ, ХОБІ', amount: '1 800.00', kind: 'expense', icon: 'fun' },
    { id: 'rc10', label: 'НАВЧАННЯ', amount: '2 400.00', kind: 'expense', icon: 'study' },
    { id: 'rc11', label: 'ІНШЕ', amount: '3 000.00', kind: 'expense', icon: 'other' },
  ],
  income: [
    { id: 'ri1', label: 'ЗП', amount: '45 000.00', kind: 'income', icon: 'salary' },
    { id: 'ri2', label: 'ДОД. ДОХІД', amount: '1 500.00', kind: 'income', icon: 'bonus' },
  ],
}

export const reportBarsByKind: Record<TransactionKind, ReportBarItem[]> = {
  expense: [
    { id: 'eb1', label: 'Свинина', amount: '5 000 грн', value: 100, highlight: true },
    { id: 'eb2', label: "Гов'ядина", amount: '4 500 грн', value: 90 },
    { id: 'eb3', label: 'Курятина', amount: '3 200 грн', value: 64 },
    { id: 'eb4', label: 'Риба', amount: '2 100 грн', value: 42, highlight: true },
    { id: 'eb5', label: 'Паніні', amount: '1 800 грн', value: 36 },
    { id: 'eb6', label: 'Кава', amount: '1 700 грн', value: 34 },
    { id: 'eb7', label: 'Спагетті', amount: '1 500 грн', value: 30, highlight: true },
    { id: 'eb8', label: 'Шоколад', amount: '800 грн', value: 16 },
    { id: 'eb9', label: 'Маслини', amount: '500 грн', value: 10 },
    { id: 'eb10', label: 'Зелень', amount: '300 грн', value: 6, highlight: true },
  ],
  income: [
    { id: 'ib1', label: 'Моя', amount: '25 000 грн', value: 100, highlight: true },
    { id: 'ib2', label: 'Дружини', amount: '20 000 грн', value: 80 },
  ],
}
