import { Navigate, createBrowserRouter } from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "../features/auth/AuthRouteBoundary";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { ReportsPage } from "../pages/ReportsPage/ReportsPage";
import { WelcomePage } from "../pages/WelcomePage/WelcomePage";
import { APP_ROUTES } from "../shared/constants/routes";

export const router = createBrowserRouter(
  [
    {
      element: <GuestRoute />,
      children: [
        {
          path: APP_ROUTES.root,
          element: <WelcomePage />,
        },
      ],
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: APP_ROUTES.dashboard,
          element: <DashboardPage />,
        },
        {
          path: APP_ROUTES.reports,
          element: <ReportsPage />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to={APP_ROUTES.root} replace />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  },
);
