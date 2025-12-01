import { useEffect, useState } from 'react'
import api from '../services/api'
import { FiPlus, FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns'

const Schedule = () => {
  const [schedules, setSchedules] = useState([])
  const [clients, setClients] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [formData, setFormData] = useState({
    client_id: '',
    workout_id: '',
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    status: 'scheduled'
  })

  useEffect(() => {
    fetchData()
  }, [currentWeek])

  const fetchData = async () => {
    try {
      const startDate = startOfWeek(currentWeek, { weekStartsOn: 1 })
      const endDate = endOfWeek(currentWeek, { weekStartsOn: 1 })

      const [schedulesRes, clientsRes, workoutsRes] = await Promise.all([
        api.get(`/schedules?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`),
        api.get('/clients'),
        api.get('/workouts')
      ])

      setSchedules(schedulesRes.data)
      setClients(clientsRes.data)
      setWorkouts(workoutsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { weekStartsOn: 1 }),
    end: endOfWeek(currentWeek, { weekStartsOn: 1 })
  })

  const getSchedulesForDay = (day) => {
    return schedules.filter(s => isSameDay(parseISO(s.start_time), day))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString()
      }

      if (editingSchedule) {
        await api.put(`/schedules/${editingSchedule.id}`, payload)
      } else {
        await api.post('/schedules', payload)
      }

      setShowModal(false)
      setEditingSchedule(null)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving schedule:', error)
      alert('Error saving schedule: ' + (error.response?.data?.error || 'Unknown error'))
    }
  }

  const resetForm = () => {
    setFormData({
      client_id: '',
      workout_id: '',
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      location: '',
      status: 'scheduled'
    })
  }

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule)
    setFormData({
      client_id: schedule.client_id.toString(),
      workout_id: schedule.workout_id ? schedule.workout_id.toString() : '',
      title: schedule.title,
      description: schedule.description || '',
      start_time: schedule.start_time.slice(0, 16),
      end_time: schedule.end_time.slice(0, 16),
      location: schedule.location || '',
      status: schedule.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return

    try {
      await api.delete(`/schedules/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting schedule:', error)
      alert('Error deleting schedule')
    }
  }

  const navigateWeek = (direction) => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + (direction * 7))))
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="mt-2 text-gray-600">Manage your training sessions</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setEditingSchedule(null)
            setShowModal(true)
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          New Session
        </button>
      </div>

      {/* Week Navigation */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateWeek(-1)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            ← Previous Week
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </h2>
          <button
            onClick={() => navigateWeek(1)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Next Week →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const daySchedules = getSchedulesForDay(day)
          return (
            <div key={index} className="bg-white rounded-lg shadow p-4 min-h-[400px]">
              <div className="mb-4">
                <p className="text-sm text-gray-600">{format(day, 'EEE')}</p>
                <p className="text-lg font-semibold text-gray-900">{format(day, 'd')}</p>
              </div>
              <div className="space-y-2">
                {daySchedules.map((schedule) => {
                  const client = clients.find(c => c.id === schedule.client_id)
                  return (
                    <div
                      key={schedule.id}
                      className="p-2 bg-primary-50 border border-primary-200 rounded text-sm"
                    >
                      <p className="font-medium text-primary-900">{schedule.title}</p>
                      <p className="text-xs text-primary-700 mt-1">
                        {format(parseISO(schedule.start_time), 'HH:mm')} - {format(parseISO(schedule.end_time), 'HH:mm')}
                      </p>
                      {client && (
                        <p className="text-xs text-primary-600 mt-1">
                          {client.first_name} {client.last_name}
                        </p>
                      )}
                      <div className="flex space-x-1 mt-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-1 text-primary-600 hover:bg-primary-100 rounded"
                        >
                          <FiEdit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(schedule.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingSchedule ? 'Edit Session' : 'New Session'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client *
                </label>
                <select
                  required
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.first_name} {client.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Plan (Optional)
                </label>
                <select
                  value={formData.workout_id}
                  onChange={(e) => setFormData({ ...formData, workout_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">None</option>
                  {workouts
                    .filter(w => !formData.client_id || w.client_id.toString() === formData.client_id)
                    .map(workout => (
                      <option key={workout.id} value={workout.id}>
                        {workout.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Gym, Online, Client Home, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingSchedule(null)
                    resetForm()
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {editingSchedule ? 'Update' : 'Create'} Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule

