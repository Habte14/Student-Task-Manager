import { styled, XStack, YStack } from 'tamagui'
import { Title, Subtitle } from '../ui/Typography'
import { PrimaryButton, GhostButton } from '../ui/Button'
import { PlusIcon, CloseIcon, MenuIcon } from '../icons'
import { colors } from '../../theme/colors'

interface PageHeaderProps {
  showForm: boolean
  onToggleForm: () => void
  onMenuPress: () => void
}

const MenuTrigger = styled(GhostButton, {
  borderWidth: 1,
  borderColor: colors.glassBorder,
  $gtMd: { display: 'none' },
})

/**
 * Header for the dashboard content column. Holds the page title, the
 * primary "New Task" action, and (mobile only) the hamburger button that
 * opens the sidebar drawer. Sits inside the content column rather than
 * spanning the full viewport width, so it never collides with the sidebar.
 */
export function PageHeader({ showForm, onToggleForm, onMenuPress }: PageHeaderProps) {
  return (
    <XStack alignItems="center" justifyContent="space-between" gap="$4" flexWrap="wrap">
      <XStack alignItems="center" gap="$3">
        <MenuTrigger onPress={onMenuPress} aria-label="Open menu">
          <MenuIcon size={18} />
        </MenuTrigger>
        <YStack>
          <Title fontSize={22}>Dashboard</Title>
          <Subtitle>Your tasks at a glance</Subtitle>
        </YStack>
      </XStack>

      <PrimaryButton onPress={onToggleForm}>
        {showForm ? <CloseIcon size={16} /> : <PlusIcon size={16} />}
        {showForm ? 'Cancel' : 'New Task'}
      </PrimaryButton>
    </XStack>
  )
}
