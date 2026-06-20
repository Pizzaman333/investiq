import { FirebaseError } from 'firebase/app'

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Ця електронна адреса вже використовується.',
  'auth/invalid-credential': 'Неправильна електронна адреса або пароль.',
  'auth/invalid-email': 'Введіть коректну електронну адресу.',
  'auth/popup-blocked': 'Браузер заблокував вікно авторизації.',
  'auth/too-many-requests': 'Забагато спроб. Спробуйте пізніше.',
  'auth/weak-password': 'Пароль має містити щонайменше 6 символів.',
  'auth/unauthorized-domain': 'Цей домен не дозволений у налаштуваннях Firebase.',
  'permission-denied': 'Недостатньо прав для виконання операції.',
  unavailable: 'Сервіс тимчасово недоступний. Перевірте з’єднання.',
}

export function getFirebaseErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] ?? 'Сталася помилка Firebase. Спробуйте ще раз.'
  }

  return error instanceof Error ? error.message : 'Сталася невідома помилка.'
}
