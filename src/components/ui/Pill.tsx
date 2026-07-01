import { styled, XStack } from 'tamagui'
import { fonts } from '../../theme/colors'

/** Small uppercase tag, used for priority badges. */
export const Pill = styled(XStack, {
  alignItems: 'center',
  gap: '$1.5',
  borderRadius: '$10',
  paddingVertical: 2,
  paddingHorizontal: '$3',
  fontFamily: fonts.mono,
  fontSize: 10,
  fontWeight: '700',
  letterSpacing: 1,
  textTransform: 'uppercase',
})

/** Pill variant sized for an icon + date string, used on task due dates. */
export const DatePill = styled(Pill, {
  marginTop: '$2.5',
  borderRadius: '$3',
  paddingVertical: '$1.5',
  paddingHorizontal: '$3',
  fontSize: 11,
  textTransform: 'none',
  letterSpacing: 0,
})
