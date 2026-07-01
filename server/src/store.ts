import { and, eq, ilike, desc } from 'drizzle-orm'
import { db } from './db/index.ts'
import { tasksTable, type DbTask } from './db/schema.ts'
import type { Task, Priority, ListTasksInput } from './schemas.ts'

function toPublicTask(task: DbTask): Task {
  return {
    id: task.id,
    userId: task.userId,
    title: task.title,
    description: task.description,
    priority: task.priority as Priority,
    dueDate: task.dueDate,
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
  }
}

export async function listTasks(userId: string, filter: ListTasksInput): Promise<Task[]> {
  const conditions = [eq(tasksTable.userId, userId)]

  if (filter.filter === 'completed') conditions.push(eq(tasksTable.completed, true))
  if (filter.filter === 'pending') conditions.push(eq(tasksTable.completed, false))
  if (filter.search) conditions.push(ilike(tasksTable.title, `%${filter.search}%`))

  const rows = await db
    .select()
    .from(tasksTable)
    .where(and(...conditions))
    .orderBy(desc(tasksTable.createdAt))

  return rows.map(toPublicTask)
}

export async function createTask(
  userId: string,
  input: { title: string; description: string; priority: Priority; dueDate: string },
): Promise<Task> {
  const [row] = await db
    .insert(tasksTable)
    .values({
      userId,
      title: input.title,
      description: input.description,
      priority: input.priority,
      dueDate: input.dueDate,
    })
    .returning()

  return toPublicTask(row)
}

export async function toggleTask(userId: string, id: string): Promise<Task | null> {
  const [existing] = await db
    .select()
    .from(tasksTable)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))

  if (!existing) return null

  const [updated] = await db
    .update(tasksTable)
    .set({ completed: !existing.completed })
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning()

  return toPublicTask(updated)
}

export async function deleteTask(userId: string, id: string): Promise<boolean> {
  const [deleted] = await db
    .delete(tasksTable)
    .where(and(eq(tasksTable.id, id), eq(tasksTable.userId, userId)))
    .returning()

  return Boolean(deleted)
}

export async function getStats(userId: string) {
  const rows = await db.select().from(tasksTable).where(eq(tasksTable.userId, userId))

  return {
    total: rows.length,
    completed: rows.filter((t) => t.completed).length,
    pending: rows.filter((t) => !t.completed).length,
    high: rows.filter((t) => t.priority === 'High' && !t.completed).length,
  }
}
