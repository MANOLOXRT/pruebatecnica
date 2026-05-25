import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function DashboardLayout() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={() => navigate('/login', { replace: true })} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
