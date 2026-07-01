import { useCallback, useEffect, useState } from 'react'
import type { FilterType, Priority, Task, User } from '../types'
import { orpc } from '../api'

const EMPTY_STATS = { total: 0, completed: 0, pending: 0, high: 0 }

export interface NewTaskInput {
  title: string
  description: string
  priority: Priority
  dueDate: string
}

/**
 * Owns task list/stats data and every task mutation (create/toggle/delete),
 * plus the search/filter state that drives the list query. Mirrors the
 * original App.tsx data logic exactly — same endpoints, same effect
 * dependencies, same error messages — just lifted out so App.tsx is pure
 * composition.
 */
export function useTasks(user: User | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [stats, setStats] = useState(EMPTY_STATS)
  const [error, setError] = useState<string | null>(null)

  const loadTasks = useCallback(async () => {
    if (!user) return
    try {
      setTasks(await orpc.tasks.list({ filter, search }))
    } catch (err) {
      console.error('Failed to load tasks:', err)
      setError('Could not load tasks. Is the server running?')
    }
  }, [filter, search, user])

  const loadStats = useCallback(async () => {
    if (!user) return
    try {
      setStats(await orpc.tasks.stats())
    } catch (err) {
      console.error('Failed to load stats:', err)
    }
  }, [user])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    loadStats()
  }, [loadTasks])

  const addTask = useCallback(
    async (input: NewTaskInput) => {
      try {
        await orpc.tasks.create(input)
        await Promise.all([loadTasks(), loadStats()])
        return true
      } catch (err) {
        console.error('Failed to create task:', err)
        setError('Could not add task. Please try again.')
        return false
      }
    },
    [loadTasks, loadStats],
  )

  const toggleComplete = useCallback(
    async (id: string) => {
      try {
        await orpc.tasks.toggle({ id })
        await Promise.all([loadTasks(), loadStats()])
      } catch (err) {
        console.error('Failed to toggle task:', err)
        setError('Could not update task. Please try again.')
      }
    },
    [loadTasks, loadStats],
  )

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await orpc.tasks.remove({ id })
        await Promise.all([loadTasks(), loadStats()])
      } catch (err) {
        console.error('Failed to delete task:', err)
        setError('Could not delete task. Please try again.')
      }
    },
    [loadTasks, loadStats],
  )

  const resetTasks = useCallback(() => {
    setTasks([])
    setStats(EMPTY_STATS)
  }, [])

  return { tasks, stats, filter, setFilter, search, setSearch, error, setError, addTask, toggleComplete, deleteTask, resetTasks }
}
