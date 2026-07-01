import { styled, YStack } from 'tamagui'
import { Title, Kicker } from '../ui/Typography'
import { IconBadge } from '../ui/IconBadge'
import { TaskIcon } from '../icons'

const EmptyWrap = styled(YStack, {
  alignItems: 'center',
  paddingVertical: 96,
  animation: 'quick',
  enterStyle: { opacity: 0, y: 16 },
})

export function EmptyState({ hasAnyTasks }: { hasAnyTasks: boolean }) {
  return (
    <EmptyWrap>
      <IconBadge size="lg" tone="muted" marginBottom="$5">
        <TaskIcon size={40} strokeWidth={1.5} />
      </IconBadge>
      <Title fontSize={24}>{hasAnyTasks ? 'No matching tasks' : 'No tasks yet'}</Title>
      <Kicker marginTop="$2">{hasAnyTasks ? 'Try adjusting your search or filter' : 'Click "New Task" to get started'}</Kicker>
    </EmptyWrap>
  )
}
