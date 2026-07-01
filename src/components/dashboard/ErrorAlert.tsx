import { styled, XStack, Text } from 'tamagui'
import { fonts } from '../../theme/colors'
import { GhostButton } from '../ui/Button'
import { CloseIcon } from '../icons'

const AlertBar = styled(XStack, {
  background: '#fff',
  color: '#000',
  borderRadius: '$6',
  paddingVertical: '$5',
  paddingHorizontal: '$6',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$4',
  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
  animation: 'quick',
  enterStyle: { opacity: 0, y: 16 },
})

export function ErrorAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <AlertBar role="alert">
      <Text fontFamily={fonts.ui} fontSize={14} fontWeight="600">{message}</Text>
      <GhostButton onPress={onDismiss} aria-label="Dismiss error" color="rgba(0,0,0,0.6)">
        <CloseIcon size={16} />
      </GhostButton>
    </AlertBar>
  )
}
