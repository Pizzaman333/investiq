import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'
import type { AuthCredentials, RegisterCredentials, UserProfile } from '../../shared/types/auth'

export interface AuthContextValue {
  profile: UserProfile | null
  user: User | null
  loading: boolean
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
