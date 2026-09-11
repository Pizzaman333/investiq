import { Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import googleIcon from '../../../../assets/icons/ui/google.svg'
import { APP_ROUTES } from '../../../../shared/constants/routes'
import { Button } from '../../../../shared/ui/Button/Button'
import { Input } from '../../../../shared/ui/Input/Input'
import { useAuth } from '../../useAuth'
import { getFirebaseErrorMessage } from '../../utils/firebaseErrors'
import styles from './RegisterCard.module.css'

interface RegisterFormValues {
  email: string
  username: string
  password: string
  passwordConfirmation: string
}

const initialValues: RegisterFormValues = {
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
}

export interface RegisterCardProps {
  onShowLogin: () => void
}

export function RegisterCard({ onShowLogin }: RegisterCardProps) {
  const navigate = useNavigate()
  const { signInWithGoogle, signUp } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <div className={styles.card}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Create an account</h2>
        <p className={styles.copy}>Fill out the form below or use Google to start using InvestIQ.</p>
      </div>

      <button
        type="button"
        className={styles.googleButton}
        onClick={() => {
          setErrorMessage('')
          void signInWithGoogle().catch((error: unknown) => {
            setErrorMessage(getFirebaseErrorMessage(error))
          })
        }}
      >
        <img className={styles.googleIcon} src={googleIcon} alt="" aria-hidden="true" />
        Google
      </button>

      <Formik
        initialValues={initialValues}
        validate={(values) => {
          const errors: Partial<Record<keyof RegisterFormValues, string>> = {}

          if (!values.email.trim()) {
            errors.email = 'Enter your email.'
          }

          if (!values.username.trim()) {
            errors.username = 'Enter your username.'
          }

          if (!values.password) {
            errors.password = 'Enter your password.'
          }

          if (!values.passwordConfirmation) {
            errors.passwordConfirmation = 'Confirm your password.'
          } else if (values.passwordConfirmation !== values.password) {
            errors.passwordConfirmation = 'Passwords do not match.'
          }

          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          setErrorMessage('')
          void signUp({
            email: values.email.trim(),
            username: values.username.trim(),
            password: values.password,
          })
            .then(() => navigate(APP_ROUTES.dashboard))
            .catch((error: unknown) => {
              setErrorMessage(getFirebaseErrorMessage(error))
            })
            .finally(() => setSubmitting(false))
        }}
      >
        {({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Email:"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
            />
            <Input
              label="Username:"
              name="username"
              type="text"
              placeholder="Your name"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username ? errors.username : undefined}
            />
            <Input
              label="Password:"
              name="password"
              type="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : undefined}
            />
            <Input
              label="Confirm password:"
              name="passwordConfirmation"
              type="password"
              placeholder="Repeat password"
              value={values.passwordConfirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.passwordConfirmation ? errors.passwordConfirmation : undefined}
            />

            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

            <div className={styles.actions}>
              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                CREATE ACCOUNT
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={onShowLogin}>
                BACK TO SIGN IN
              </Button>
            </div>
          </form>
        )}
      </Formik>

      <p className={styles.footer}>Already have an account? <button className={styles.link} type="button" onClick={onShowLogin}>Sign in</button></p>
    </div>
  )
}
