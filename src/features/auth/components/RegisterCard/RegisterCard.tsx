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
        <h2 className={styles.title}>Створити акаунт</h2>
        <p className={styles.copy}>Заповніть форму нижче або скористайтеся Google, щоб почати роботу з InvestIQ.</p>
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
            errors.email = 'Введіть email.'
          }

          if (!values.username.trim()) {
            errors.username = "Введіть ім'я користувача."
          }

          if (!values.password) {
            errors.password = 'Введіть пароль.'
          }

          if (!values.passwordConfirmation) {
            errors.passwordConfirmation = 'Підтвердіть пароль.'
          } else if (values.passwordConfirmation !== values.password) {
            errors.passwordConfirmation = 'Паролі не співпадають.'
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
              label="Ім'я користувача:"
              name="username"
              type="text"
              placeholder="Ваше ім'я"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.username ? errors.username : undefined}
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
            <Input
              label="Підтвердження паролю:"
              name="passwordConfirmation"
              type="password"
              placeholder="Повторіть пароль"
              value={values.passwordConfirmation}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.passwordConfirmation ? errors.passwordConfirmation : undefined}
            />

            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

            <div className={styles.actions}>
              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                ЗАРЕЄСТРУВАТИСЯ
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={onShowLogin}>
                ДО ВХОДУ
              </Button>
            </div>
          </form>
        )}
      </Formik>

      <p className={styles.footer}>Вже маєте акаунт? <button className={styles.link} type="button" onClick={onShowLogin}>Увійти</button></p>
    </div>
  )
}
