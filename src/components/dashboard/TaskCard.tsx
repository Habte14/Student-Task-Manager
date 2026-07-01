import { styled, XStack, YStack, Text } from 'tamagui'
import type { Task } from '../../types'
import { colors, fonts } from '../../theme/colors'
import { Surface } from '../ui/Surface'
import { Pill, DatePill } from '../ui/Pill'
import { GhostButton } from '../ui/Button'
import { CalendarIcon, CheckIcon, TrashIcon } from '../icons'

const Card = styled(Surface, {
  borderRadius: '$6',
  borderLeftWidth: 4,
  overflow: 'hidden',
  boxShadow: '0 4px 8px rgba(0,0,0,0.18)',
  animation: 'quick',
  enterStyle: { opacity: 0, y: 16 },
  hoverStyle: { y: -3, borderColor: colors.glassBorderStrong, boxShadow: '0 15px 25px rgba(0,0,0,0.25)' },
})

const CardInner = styled(XStack, { padding: '$5', alignItems: 'flex-start', gap: '$4' })

const Checkbox = styled(XStack, {
  tag: 'button',
  marginTop: 2,
  width: 24,
  height: 24,
  borderRadius: '$3',
  borderWidth: 2,
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  cursor: 'pointer',
  animation: 'bouncy',
  hoverStyle: { scale: 1.08 },
  pressStyle: { scale: 0.92 },
})

const TaskTitleText = styled(Text, {
  tag: 'h3',
  margin: 0,
  fontFamily: fonts.display,
  fontSize: 16,
  fontWeight: '700',
})

function isOverdue(dateStr: string, completed: boolean) {
  return !!dateStr && !completed && new Date(dateStr) < new Date(new Date().toDateString())
}

interface TaskCardProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.completed)
  const priority = colors.priority[task.priority]

  return (
    <Card
      style={{
        borderLeftColor: task.completed ? colors.textDisabled : priority.border,
        opacity: task.completed ? 0.4 : 1,
        boxShadow: overdue ? `0 0 0 1px ${colors.glassBorder}` : undefined,
      }}
    >
      <CardInner>
        <Checkbox
          onPress={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          style={{ background: task.completed ? '#fff' : 'transparent', borderColor: task.completed ? '#fff' : colors.textDisabled }}
        >
          {task.completed && <CheckIcon size={14} />}
        </Checkbox>

        <YStack flex={1} minWidth={0}>
          <XStack alignItems="center" gap="$2.5" flexWrap="wrap">
            <TaskTitleText
              style={{ color: task.completed ? colors.textDisabled : colors.textPrimary, textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              {task.title}
            </TaskTitleText>
            <Pill style={{ background: priority.badge, color: priority.text, border: task.priority === 'Low' ? '1px solid #d1d5db' : undefined }}>
              {task.priority}
            </Pill>
          </XStack>

          {task.description && (
            <Text
              marginTop="$1.5"
              color={task.completed ? colors.textDisabled : colors.textMuted}
              fontSize={14}
              lineHeight={22}
              style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              {task.description}
            </Text>
          )}

          {task.dueDate && (
            <DatePill
              style={{
                background: overdue ? '#fff' : task.completed ? colors.glassBgSofter : colors.glassBgSoft,
                color: overdue ? '#000' : task.completed ? colors.textDisabled : colors.textSecondary,
              }}
            >
              <CalendarIcon size={12} />
              {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              {overdue && ' overdue'}
            </DatePill>
          )}
        </YStack>

        <GhostButton onPress={() => onDelete(task.id)} aria-label="Delete task" title="Delete task">
          <TrashIcon size={16} />
        </GhostButton>
      </CardInner>
    </Card>
  )
}
