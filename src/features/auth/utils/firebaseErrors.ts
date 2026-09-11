import { FirebaseError } from 'firebase/app'

const ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'This email address is already in use.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/popup-blocked': 'The browser blocked the authorization window.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/weak-password': 'Password must contain at least 6 characters.',
  'auth/unauthorized-domain': 'This domain is not allowed in Firebase settings.',
  'permission-denied': 'You do not have permission to complete this action.',
  unavailable: 'The service is temporarily unavailable. Check your connection.',
}

export function getFirebaseErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    return ERROR_MESSAGES[error.code] ?? 'A Firebase error occurred. Please try again.'
  }

  return error instanceof Error ? error.message : 'An unknown error occurred.'
}
