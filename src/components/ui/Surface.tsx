import { styled, YStack } from 'tamagui'
import { colors } from '../../theme/colors'

/**
 * Frosted "glass" panel used as the base for cards, the sidebar, inputs
 * wrappers, etc. Defined once so every panel in the app shares the exact
 * same background/border/blur instead of each component re-declaring it
 * (which is how the original code ended up with subtly mismatched panels).
 */
export const Surface = styled(YStack, {
  background: colors.glassBg,
  backdropFilter: 'blur(24px)',
  borderWidth: 1,
  borderColor: colors.glassBorder,
})

/** Page-level container that centers content and applies consistent gutters. */
export const PageContainer = styled(YStack, {
  width: '100%',
  maxWidth: 1100,
  marginHorizontal: 'auto',
  paddingHorizontal: '$4',
})
