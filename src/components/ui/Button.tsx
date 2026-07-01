import { styled, XStack } from 'tamagui'
import { colors, fonts } from '../../theme/colors'

const ButtonBase = styled(XStack, {
  tag: 'button',
  borderWidth: 0,
  borderRadius: '$4',
  cursor: 'pointer',
  fontFamily: fonts.ui,
  fontSize: 14,
  fontWeight: '700',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  animation: 'quick',
  pressStyle: { scale: 0.97 },
  disabledStyle: { opacity: 0.5, cursor: 'not-allowed' },
})

/** Solid white call-to-action button (primary action on dark surfaces). */
export const PrimaryButton = styled(ButtonBase, {
  paddingVertical: '$2.5',
  paddingHorizontal: '$6',
  background: colors.surfaceInverse,
  color: colors.textOnLight,
  hoverStyle: { background: colors.surfaceInverseHover, scale: 1.02 },
  focusStyle: { outlineWidth: 2, outlineColor: colors.glassBorderFocus, outlineStyle: 'solid' },
})

/** Transparent, icon-sized button for secondary/destructive actions. */
export const GhostButton = styled(ButtonBase, {
  padding: '$2',
  background: 'transparent',
  color: colors.textMuted,
  hoverStyle: { background: colors.glassBgSoft, color: colors.textPrimary },
})

/** Outlined button, used for "Cancel" style secondary actions. */
export const OutlineButton = styled(ButtonBase, {
  paddingVertical: '$2.5',
  paddingHorizontal: '$6',
  borderWidth: 2,
  borderColor: colors.glassBorderStrong,
  background: 'transparent',
  color: colors.textSecondary,
  hoverStyle: { background: colors.glassBgSofter },
})

/** Full-width variant of PrimaryButton, used on the auth screen. */
export const PrimaryButtonBlock = styled(PrimaryButton, {
  width: '100%',
  justifyContent: 'center',
})
