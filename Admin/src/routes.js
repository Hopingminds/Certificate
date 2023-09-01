import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
// import SimpleLayout from './layouts/simple';

// import UserPage from './pages/UserPage';
// import LoginPage from './pages/LoginPage';
// import Page404 from './pages/Page404';

import DashboardAppPage from './pages/DashboardAppPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
       
      ],
    },
    
    {
      
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
