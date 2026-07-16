import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { bootstrapUserData, subscribeToUserProfile } from '../finance/services/financeService'
import { auth, googleProvider } from '../../shared/lib/firebase'
import type { UserProfile } from '../../shared/types/auth'
import { DEMO_PROFILE } from '../demo/demoData'
import { AuthContext, type AuthContextValue } from './useAuth'

const DEMO_SESSION_KEY = 'investiq.demoSession'

function fallbackProfile(user: User): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: null,
    updatedAt: null,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isDemoSession, setIsDemoSession] = useState(
    () => sessionStorage.getItem(DEMO_SESSION_KEY) === 'true',
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeProfile = () => {}

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeProfile()

      if (!firebaseUser) {
        setUser(null)
        setProfile(isDemoSession ? DEMO_PROFILE : null)
        setLoading(false)
        return
      }

      sessionStorage.removeItem(DEMO_SESSION_KEY)
      setIsDemoSession(false)
      setUser(firebaseUser)
      setProfile(fallbackProfile(firebaseUser))
      setLoading(false)

      void bootstrapUserData(firebaseUser)
        .then(() => {
          unsubscribeProfile = subscribeToUserProfile(
            firebaseUser,
            (nextProfile) => {
              setProfile(nextProfile)
              setLoading(false)
            },
            () => {
              setProfile(fallbackProfile(firebaseUser))
              setLoading(false)
            },
          )
        })
        .catch(() => {
          setProfile(fallbackProfile(firebaseUser))
          setLoading(false)
        })
    })

    return () => {
      unsubscribeProfile()
      unsubscribeAuth()
    }
  }, [isDemoSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      profile,
      user,
      loading,
      async signIn({ email, password }) {
        await signInWithEmailAndPassword(auth, email, password)
      },
      async signUp({ email, password, username }) {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(credential.user, { displayName: username })
        await bootstrapUserData(credential.user, username)
      },
      async signInWithGoogle() {
        await signInWithRedirect(auth, googleProvider)
      },
      startDemoSession() {
        sessionStorage.setItem(DEMO_SESSION_KEY, 'true')
        setIsDemoSession(true)
        setUser(null)
        setProfile(DEMO_PROFILE)
      },
      async signOutUser() {
        sessionStorage.removeItem(DEMO_SESSION_KEY)
        setIsDemoSession(false)
        setProfile(null)
        await signOut(auth)
      },
      mode: user ? 'firebase' : isDemoSession ? 'demo' : 'guest',
      isAuthenticated: Boolean(user || isDemoSession),
    }),
    [isDemoSession, loading, profile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
