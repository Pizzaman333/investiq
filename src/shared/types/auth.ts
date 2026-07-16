export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  createdAt: Date | null
  updatedAt: Date | null
}

export type AuthMode = 'firebase' | 'demo' | 'guest'

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends AuthCredentials {
  username: string
}
