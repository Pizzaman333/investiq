import { createContext, useContext } from 'react'
import type { User } from 'firebase/auth'
import type { AuthCredentials, AuthMode, RegisterCredentials, UserProfile } from '../../shared/types/auth'

export interface AuthContextValue {
  profile: UserProfile | null
  user: User | null
  loading: boolean
  mode: AuthMode
  isAuthenticated: boolean
  signIn: (credentials: AuthCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signInWithGoogle: () => Promise<void>
  startDemoSession: () => void
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
