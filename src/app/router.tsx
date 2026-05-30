import { Navigate, createBrowserRouter } from 'react-router-dom'
import { DashboardPage } from '../pages/DashboardPage/DashboardPage'
import { ReportsPage } from '../pages/ReportsPage/ReportsPage'
import { WelcomePage } from '../pages/WelcomePage/WelcomePage'
import { APP_ROUTES } from '../shared/constants/routes'

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.root,
    element: <WelcomePage />,
  },
  {
    path: APP_ROUTES.dashboard,
    element: <DashboardPage />,
  },
  {
    path: APP_ROUTES.reports,
    element: <ReportsPage />,
  },
  {
    path: '*',
    element: <Navigate to={APP_ROUTES.root} replace />,
  },
])
