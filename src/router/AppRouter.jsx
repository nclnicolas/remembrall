import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '../constants/navigation'
import Layout from '../components/layout/Layout'
import Dashboard from '../pages/Dashboard/Dashboard'
import Pending from '../pages/Pending/Pending'
import Completed from '../pages/Completed/Completed'
import Settings from '../pages/Settings/Settings'
import NotFound from '../pages/NotFound/NotFound'

function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route
          path={ROUTES.REMINDERS}
          element={<Navigate to={ROUTES.REMINDERS_PENDING} replace />}
        />
        <Route path={ROUTES.REMINDERS_PENDING} element={<Pending />} />
        <Route path={ROUTES.REMINDERS_COMPLETED} element={<Completed />} />
        <Route path={ROUTES.SETTINGS} element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
