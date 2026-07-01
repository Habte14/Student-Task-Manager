import { styled, YStack } from 'tamagui'
import type { Task } from '../../types'
import { TaskCard } from './TaskCard'

const List = styled(YStack, { gap: '$3' })

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <List role="list" aria-label="Tasks">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </List>
  )
}
