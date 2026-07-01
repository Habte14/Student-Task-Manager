import { styled, YStack } from 'tamagui'
import { colors, fonts } from '../../theme/colors'

const inputBase = {
  width: '100%',
  paddingVertical: '$3',
  paddingHorizontal: '$4',
  borderRadius: '$4',
  borderWidth: 2,
  borderColor: colors.glassBorder,
  outlineStyle: 'none',
  background: colors.glassBgSoft,
  color: colors.textPrimary,
  fontFamily: fonts.body,
  animation: 'quick',
  focusStyle: { borderColor: colors.glassBorderFocus, background: 'rgba(255,255,255,0.14)' },
} as const

export const TextInput = styled('input', inputBase)
export const TextArea = styled('textarea', { ...inputBase, resize: 'none' })
export const Select = styled('select', { ...inputBase, cursor: 'pointer', colorScheme: 'dark' })

export const FieldLabel = styled('label', {
  display: 'block',
  marginBottom: '$1.5',
  color: colors.textMuted,
  fontFamily: fonts.mono,
  fontSize: 12,
  fontWeight: '700',
  letterSpacing: 1,
  textTransform: 'uppercase',
})

/** Form field that takes half the row width on $gtXs and up, full width below. */
export const Field = styled(YStack, { width: '100%', $gtXs: { width: '48%' } })

/** Form field that always spans the full row width. */
export const WideField = styled(YStack, { width: '100%' })
