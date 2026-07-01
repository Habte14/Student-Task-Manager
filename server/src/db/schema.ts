import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const tasksTable = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description').notNull().default(''),
  priority: varchar('priority', { length: 10, enum: ['High', 'Medium', 'Low'] }).notNull().default('Medium'),
  dueDate: varchar('due_date', { length: 32 }).notNull().default(''),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type DbUser = typeof usersTable.$inferSelect
export type DbNewUser = typeof usersTable.$inferInsert
export type DbTask = typeof tasksTable.$inferSelect
export type DbNewTask = typeof tasksTable.$inferInsert
