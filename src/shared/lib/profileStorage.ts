const balanceHintStorageKey = (uid: string) => `investiq:balance-hint-dismissed:${uid}`

export function isBalanceHintDismissed(uid: string) {
  return window.localStorage.getItem(balanceHintStorageKey(uid)) === 'true'
}

export function dismissBalanceHint(uid: string) {
  window.localStorage.setItem(balanceHintStorageKey(uid), 'true')
}
