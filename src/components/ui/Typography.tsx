import { styled, Text, H1 } from 'tamagui'
import { colors, fonts } from '../../theme/colors'

export const Title = styled(H1, {
  margin: 0,
  color: colors.textPrimary,
  fontFamily: fonts.heading,
  fontSize: 20,
  fontWeight: '900',
})

export const Subtitle = styled(Text, {
  margin: 0,
  color: colors.textMuted,
  fontFamily: fonts.body,
  fontSize: 14,
})

/** Small uppercase, letter-spaced caption used for eyebrow/meta text. */
export const Kicker = styled(Text, {
  margin: 0,
  color: colors.textMuted,
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: 2,
  textTransform: 'uppercase',
})

export const SectionLabel = styled(Text, {
  margin: 0,
  color: colors.textMuted,
  fontFamily: fonts.mono,
  fontSize: 12,
  fontWeight: '700',
  letterSpacing: 1,
  textTransform: 'uppercase',
})
