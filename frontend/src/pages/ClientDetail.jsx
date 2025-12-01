import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { FiUser, FiActivity, FiCalendar, FiTrendingUp } from 'react-icons/fi'

const ClientDetail = () => {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClientData()
  }, [id])

  const fetchClientData = async () => {
    try {
      const [clientRes, workoutsRes] = await Promise.all([
        api.get(`/clients/${id}`),
        api.get(`/workouts?client_id=${id}`)
      ])
      setClient(clientRes.data)
      setWorkouts(workoutsRes.data)
    } catch (error) {
      console.error('Error fetching client data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!client) {
    return <div className="text-center py-12">Client not found</div>
  }

  return (
    <div>
      <Link
        to="/clients"
        className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
      >
        ← Back to Clients
      </Link>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
              <FiUser className="text-primary-600 text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {client.first_name} {client.last_name}
              </h1>
              <p className="text-gray-600 mt-1">{client.email || client.phone}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-sm rounded-full ${
            client.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {client.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          <div>
            <p className="text-sm text-gray-600">Date of Birth</p>
            <p className="font-medium">
              {client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Gender</p>
            <p className="font-medium">{client.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Height</p>
            <p className="font-medium">{client.height ? `${client.height} cm` : 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Weight</p>
            <p className="font-medium">{client.weight ? `${client.weight} kg` : 'N/A'}</p>
          </div>
        </div>

        {client.fitness_goals && (
          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Fitness Goals</p>
            <p className="text-gray-900">{client.fitness_goals}</p>
          </div>
        )}

        {client.medical_notes && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Medical Notes</p>
            <p className="text-gray-900">{client.medical_notes}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiActivity className="mr-2" />
              Workout Plans
            </h2>
            <Link
              to={`/workouts?client_id=${id}`}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {workouts.length > 0 ? (
              workouts.slice(0, 5).map((workout) => (
                <Link
                  key={workout.id}
                  to={`/workouts?client_id=${id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <p className="font-medium">{workout.name}</p>
                  <p className="text-sm text-gray-600">
                    {workout.exercises.length} exercises • {workout.difficulty_level}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No workout plans yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FiTrendingUp className="mr-2" />
              Progress Tracking
            </h2>
            <Link
              to={`/progress/${id}`}
              className="text-primary-600 hover:text-primary-700 text-sm"
            >
              View all
            </Link>
          </div>
          <Link
            to={`/progress/${id}`}
            className="block p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-primary-500 transition-colors"
          >
            <p className="text-gray-600">Track client progress</p>
            <p className="text-sm text-gray-500 mt-1">Weight, measurements, photos, and more</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ClientDetail

