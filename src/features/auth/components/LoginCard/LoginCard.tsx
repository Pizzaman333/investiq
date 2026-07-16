import { Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import googleIcon from '../../../../assets/icons/ui/google.svg'
import { APP_ROUTES } from '../../../../shared/constants/routes'
import { Button } from '../../../../shared/ui/Button/Button'
import { Input } from '../../../../shared/ui/Input/Input'
import { useAuth } from '../../useAuth'
import { getFirebaseErrorMessage } from '../../utils/firebaseErrors'
import { RegisterCard } from '../RegisterCard/RegisterCard'
import styles from './LoginCard.module.css'

const loginInitialValues = {
  email: '',
  password: '',
}

export function LoginCard() {
  const navigate = useNavigate()
  const { signIn, signInWithGoogle, startDemoSession } = useAuth()
  const [errorMessage, setErrorMessage] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')

  if (mode === 'register') {
    return <RegisterCard onShowLogin={() => setMode('login')} />
  }

  return (
    <div className={styles.card}>
      <p className={styles.copy}>Ви можете авторизуватися за допомогою акаунта Google</p>
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
        <img className={styles.googleMark} src={googleIcon} alt="" aria-hidden="true" />
        Google
      </button>

      <p className={styles.copy}>Або увійти за допомогою ел. пошти та паролю після реєстрації</p>

      <Formik
        initialValues={loginInitialValues}
        validate={(values) => {
          const errors: Partial<Record<keyof typeof values, string>> = {}

          if (!values.email.trim()) {
            errors.email = 'Введіть email.'
          }

          if (!values.password) {
            errors.password = 'Введіть пароль.'
          }

          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          setErrorMessage('')
          void signIn({
            email: values.email.trim(),
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
              label="Електронна пошта:"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : undefined}
            />
            <Input
              label="Пароль:"
              name="password"
              type="password"
              placeholder="Пароль"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : undefined}
            />
            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}
            <div className={styles.actions}>
              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                УВІЙТИ
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={() => setMode('register')}>
                РЕЄСТРАЦІЯ
              </Button>
            </div>
            <button
              type="button"
              className={styles.demoButton}
              onClick={() => {
                setErrorMessage('')
                startDemoSession()
                navigate(APP_ROUTES.dashboard)
              }}
            >
              Спробувати демо без реєстрації
            </button>
          </form>
        )}
      </Formik>
    </div>
  )
}
