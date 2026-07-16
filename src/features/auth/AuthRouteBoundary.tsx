import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '../../shared/constants/routes'
import { Loader } from '../../shared/ui/Loader/Loader'
import { useAuth } from './useAuth'

function RouteLoadingState() {
  return <Loader show message="Завантаження..." />
}

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <RouteLoadingState />
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_ROUTES.root} replace state={{ from: location }} />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <RouteLoadingState />
  }

  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.dashboard} replace />
  }

  return <Outlet />
}
