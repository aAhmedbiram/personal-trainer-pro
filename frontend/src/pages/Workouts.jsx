import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi'

const Workouts = () => {
  const [searchParams] = useSearchParams()
  const clientId = searchParams.get('client_id')
  const [workouts, setWorkouts] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingWorkout, setEditingWorkout] = useState(null)
  const [formData, setFormData] = useState({
    client_id: clientId || '',
    name: '',
    description: '',
    duration_minutes: '',
    difficulty_level: 'intermediate',
    exercises: [{ name: '', sets: '', reps: '', weight: '', rest_seconds: '', notes: '' }]
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [workoutsRes, clientsRes] = await Promise.all([
        api.get(`/workouts${clientId ? `?client_id=${clientId}` : ''}`),
        api.get('/clients')
      ])
      setWorkouts(workoutsRes.data)
      setClients(clientsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
        exercises: formData.exercises
          .filter(ex => ex.name)
          .map((ex, idx) => ({
            ...ex,
            sets: ex.sets ? parseInt(ex.sets) : null,
            weight: ex.weight ? parseFloat(ex.weight) : null,
            rest_seconds: ex.rest_seconds ? parseInt(ex.rest_seconds) : null,
            order: idx
          }))
      }

      if (editingWorkout) {
        await api.put(`/workouts/${editingWorkout.id}`, payload)
      } else {
        await api.post('/workouts', payload)
      }

      setShowModal(false)
      setEditingWorkout(null)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving workout:', error)
      alert('Error saving workout: ' + (error.response?.data?.error || 'Unknown error'))
    }
  }

  const resetForm = () => {
    setFormData({
      client_id: clientId || '',
      name: '',
      description: '',
      duration_minutes: '',
      difficulty_level: 'intermediate',
      exercises: [{ name: '', sets: '', reps: '', weight: '', rest_seconds: '', notes: '' }]
    })
  }

  const handleEdit = (workout) => {
    setEditingWorkout(workout)
    setFormData({
      client_id: workout.client_id,
      name: workout.name,
      description: workout.description || '',
      duration_minutes: workout.duration_minutes || '',
      difficulty_level: workout.difficulty_level || 'intermediate',
      exercises: workout.exercises.length > 0
        ? workout.exercises.map(ex => ({
            name: ex.name,
            sets: ex.sets || '',
            reps: ex.reps || '',
            weight: ex.weight || '',
            rest_seconds: ex.rest_seconds || '',
            notes: ex.notes || ''
          }))
        : [{ name: '', sets: '', reps: '', weight: '', rest_seconds: '', notes: '' }]
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this workout?')) return

    try {
      await api.delete(`/workouts/${id}`)
      fetchData()
    } catch (error) {
      console.error('Error deleting workout:', error)
      alert('Error deleting workout')
    }
  }

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: '', reps: '', weight: '', rest_seconds: '', notes: '' }]
    })
  }

  const removeExercise = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    })
  }

  const updateExercise = (index, field, value) => {
    const newExercises = [...formData.exercises]
    newExercises[index][field] = value
    setFormData({ ...formData, exercises: newExercises })
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workout Plans</h1>
          <p className="mt-2 text-gray-600">Create and manage workout plans for your clients</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setEditingWorkout(null)
            setShowModal(true)
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Create Workout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workouts.map((workout) => {
          const client = clients.find(c => c.id === workout.client_id)
          return (
            <div key={workout.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                  {client && (
                    <p className="text-sm text-gray-600 mt-1">
                      {client.first_name} {client.last_name}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(workout)}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              {workout.description && (
                <p className="text-sm text-gray-600 mb-4">{workout.description}</p>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Exercises:</span>
                  <span className="font-medium">{workout.exercises.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{workout.duration_minutes || 'N/A'} min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs">
                    {workout.difficulty_level}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {workouts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No workout plans yet</p>
        </div>
      )}

      {/* Workout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingWorkout ? 'Edit Workout' : 'Create Workout'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  Workout Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.difficulty_level}
                    onChange={(e) => setFormData({ ...formData, difficulty_level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Exercises
                  </label>
                  <button
                    type="button"
                    onClick={addExercise}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Exercise
                  </button>
                </div>
                <div className="space-y-4">
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Exercise {index + 1}</h4>
                        {formData.exercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExercise(index)}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Name *</label>
                          <input
                            type="text"
                            required
                            value={exercise.name}
                            onChange={(e) => updateExercise(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Sets</label>
                            <input
                              type="number"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(index, 'sets', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Reps</label>
                            <input
                              type="text"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(index, 'reps', e.target.value)}
                              placeholder="10-12"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={exercise.weight}
                              onChange={(e) => updateExercise(index, 'weight', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Rest (seconds)</label>
                          <input
                            type="number"
                            value={exercise.rest_seconds}
                            onChange={(e) => updateExercise(index, 'rest_seconds', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Notes</label>
                          <textarea
                            value={exercise.notes}
                            onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingWorkout(null)
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
                  {editingWorkout ? 'Update' : 'Create'} Workout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Workouts

