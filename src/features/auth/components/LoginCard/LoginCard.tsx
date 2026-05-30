import { Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '../../../../shared/constants/routes'
import { loginInitialValues } from '../../../../shared/constants/mockData'
import { Button } from '../../../../shared/ui/Button/Button'
import { Input } from '../../../../shared/ui/Input/Input'
import styles from './LoginCard.module.css'

export function LoginCard() {
  const navigate = useNavigate()

  return (
    <div className={styles.card}>
      <p className={styles.copy}>Ви можете авторизуватися за допомогою акаунта Google</p>
      <button type="button" className={styles.googleButton} onClick={() => navigate(APP_ROUTES.dashboard)}>
        <span className={styles.googleMark} aria-hidden="true">
          G
        </span>
        Google
      </button>

      <p className={styles.copy}>Або увійти за допомогою ел. пошти та паролю після реєстрації</p>

      <Formik initialValues={loginInitialValues} onSubmit={() => navigate(APP_ROUTES.dashboard)}>
        {({ values, handleChange, handleSubmit }) => (
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="Електронна пошта:"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={values.email}
              onChange={handleChange}
            />
            <Input
              label="Пароль:"
              name="password"
              type="password"
              placeholder="........"
              value={values.password}
              onChange={handleChange}
            />
            <div className={styles.actions}>
              <Button type="submit" variant="primary" fullWidth>
                УВІЙТИ
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={() => navigate(APP_ROUTES.dashboard)}>
                РЕЄСТРАЦІЯ
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}
