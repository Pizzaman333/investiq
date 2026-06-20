import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '../../shared/constants/routes'
import { Loader } from '../../shared/ui/Loader/Loader'
import { useAuth } from './useAuth'

function RouteLoadingState() {
  return <Loader show message="Завантаження..." />
}

export function ProtectedRoute() {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <RouteLoadingState />
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.root} replace state={{ from: location }} />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { loading, user } = useAuth()

  if (loading) {
    return <RouteLoadingState />
  }

  if (user) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return <Outlet />
}
