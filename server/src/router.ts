import { os, ORPCError } from '@orpc/server'
import {
  CreateTaskInputSchema,
  ListTasksInputSchema,
  TaskIdInputSchema,
  TaskSchema,
  StatsSchema,
  DeleteResultSchema,
} from './schemas.ts'
import { listTasks, createTask, toggleTask, deleteTask, getStats } from './store.ts'
import type { AuthContext } from './context.ts'
import { authRouter } from './auth-router.ts'

const base = os.$context<AuthContext>()

// Every task procedure requires a logged-in user. This middleware guards
// access and narrows the context so handlers can rely on `userId` being
// a non-null string.
const authed = base.use(({ context, next }) => {
  if (!context.userId) {
    throw new ORPCError('UNAUTHORIZED', { message: 'You must be logged in' })
  }
  return next({ context: { ...context, userId: context.userId } })
})

// --- tasks.list ---
const list = authed
  .input(ListTasksInputSchema)
  .output(TaskSchema.array())
  .handler(async ({ input, context }) => {
    return listTasks(context.userId, input)
  })

// --- tasks.create ---
const create = authed
  .input(CreateTaskInputSchema)
  .output(TaskSchema)
  .handler(async ({ input, context }) => {
    return createTask(context.userId, {
      title: input.title,
      description: input.description ?? '',
      priority: input.priority ?? 'Medium',
      dueDate: input.dueDate ?? '',
    })
  })

// --- tasks.toggle ---
const toggle = authed
  .input(TaskIdInputSchema)
  .output(TaskSchema)
  .handler(async ({ input, context }) => {
    const task = await toggleTask(context.userId, input.id)
    if (!task) {
      throw new ORPCError('NOT_FOUND', { message: 'Task not found' })
    }
    return task
  })

// --- tasks.remove ---
const remove = authed
  .input(TaskIdInputSchema)
  .output(DeleteResultSchema)
  .handler(async ({ input, context }) => {
    const deleted = await deleteTask(context.userId, input.id)
    if (!deleted) {
      throw new ORPCError('NOT_FOUND', { message: 'Task not found' })
    }
    return { message: 'Task deleted', id: input.id }
  })

// --- tasks.stats ---
const stats = authed
  .output(StatsSchema)
  .handler(async ({ context }) => {
    return getStats(context.userId)
  })

export const router = {
  auth: authRouter,
  tasks: {
    list,
    create,
    toggle,
    remove,
    stats,
  },
}

export type AppRouter = typeof router
