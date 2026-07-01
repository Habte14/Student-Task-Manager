export type Priority = 'High' | 'Medium' | 'Low'

export interface Task {
  id: string
  userId: string
  title: string
  description: string
  priority: Priority
  dueDate: string
  completed: boolean
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export type FilterType = 'all' | 'completed' | 'pending'
