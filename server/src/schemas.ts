import { z } from 'zod'

export const PrioritySchema = z.enum(['High', 'Medium', 'Low'])

export const TaskSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  priority: PrioritySchema,
  dueDate: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
})

export const CreateTaskInputSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional().default(''),
  priority: PrioritySchema.optional().default('Medium'),
  dueDate: z.string().optional().default(''),
})

export const ListTasksInputSchema = z.object({
  filter: z.enum(['all', 'completed', 'pending']).optional().default('all'),
  search: z.string().optional().default(''),
})

export const TaskIdInputSchema = z.object({
  id: z.string().min(1, 'Task id is required'),
})

export const StatsSchema = z.object({
  total: z.number(),
  completed: z.number(),
  pending: z.number(),
  high: z.number(),
})

export const DeleteResultSchema = z.object({
  message: z.string(),
  id: z.string(),
})

export type Priority = z.infer<typeof PrioritySchema>
export type Task = z.infer<typeof TaskSchema>
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>
export type ListTasksInput = z.infer<typeof ListTasksInputSchema>
export type Stats = z.infer<typeof StatsSchema>

// --- Auth ---

export const SignupInputSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const LoginInputSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
})

export type SignupInput = z.infer<typeof SignupInputSchema>
export type LoginInput = z.infer<typeof LoginInputSchema>
export type User = z.infer<typeof UserSchema>

