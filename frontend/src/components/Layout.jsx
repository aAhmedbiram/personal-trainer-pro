import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  FiHome, 
  FiUsers, 
  FiActivity, 
  FiCalendar, 
  FiUser,
  FiLogOut
} from 'react-icons/fi'

const Layout = () => {
  const { trainer, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome },
    { name: 'Clients', href: '/clients', icon: FiUsers },
    { name: 'Workouts', href: '/workouts', icon: FiActivity },
    { name: 'Schedule', href: '/schedule', icon: FiCalendar },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-primary-600 text-white">
            <h1 className="text-xl font-bold">Trainer Pro</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <Link
              to="/profile"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive('/profile')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiUser className="mr-3 h-5 w-5" />
              Profile
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors mt-2"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
            {trainer && (
              <div className="mt-4 px-4 py-2 text-xs text-gray-500">
                <p className="font-medium">{trainer.first_name} {trainer.last_name}</p>
                <p className="truncate">{trainer.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

