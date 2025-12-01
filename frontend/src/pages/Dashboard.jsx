import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import { FiUsers, FiActivity, FiCalendar, FiTrendingUp } from 'react-icons/fi'

const Dashboard = () => {
  const { trainer } = useAuth()
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalWorkouts: 0,
    upcomingSessions: 0
  })
  const [recentClients, setRecentClients] = useState([])
  const [upcomingSessions, setUpcomingSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [clientsRes, workoutsRes, schedulesRes] = await Promise.all([
        api.get('/clients'),
        api.get('/workouts'),
        api.get('/schedules?start_date=' + new Date().toISOString())
      ])

      const clients = clientsRes.data
      const workouts = workoutsRes.data
      const schedules = schedulesRes.data.filter(s => 
        new Date(s.start_time) >= new Date() && s.status === 'scheduled'
      ).slice(0, 5)

      setStats({
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === 'active').length,
        totalWorkouts: workouts.length,
        upcomingSessions: schedules.length
      })

      setRecentClients(clients.slice(0, 5))
      setUpcomingSessions(schedules)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {trainer?.first_name}!
        </h1>
        <p className="mt-2 text-gray-600">Here's what's happening with your business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={FiUsers}
          color="blue"
        />
        <StatCard
          title="Active Clients"
          value={stats.activeClients}
          icon={FiTrendingUp}
          color="green"
        />
        <StatCard
          title="Workout Plans"
          value={stats.totalWorkouts}
          icon={FiActivity}
          color="purple"
        />
        <StatCard
          title="Upcoming Sessions"
          value={stats.upcomingSessions}
          icon={FiCalendar}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Clients</h2>
            <Link
              to="/clients"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentClients.length > 0 ? (
              recentClients.map((client) => (
                <Link
                  key={client.id}
                  to={`/clients/${client.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{client.email || client.phone}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    client.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {client.status}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No clients yet</p>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
            <Link
              to="/schedule"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-lg border border-gray-200"
                >
                  <p className="font-medium text-gray-900">{session.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(session.start_time).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming sessions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

