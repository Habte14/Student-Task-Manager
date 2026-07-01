import { styled, XStack, YStack } from 'tamagui'
import { fonts } from '../../theme/colors'
import { SectionLabel } from '../ui/Typography'

export interface StatCardData {
  label: string
  value: number
  background: string
  color: string
  border: string
}

const Grid = styled(XStack, {
  display: 'grid',
  gap: '$4',
  // Plain CSS grid, not Tamagui's $gtXs/$gtSm variants: each card is at
  // least 220px wide, and the grid fits as many equal-width columns as
  // the row has room for (1 on phones, up to 4 on desktop) without
  // depending on Tamagui's breakpoint-variant compiler at all.
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
})

/**
 * One card per row on phones, growing to as many equal columns as fit
 * (up to four) on wider screens — handled entirely by the parent Grid's
 * CSS `grid-template-columns`, so it doesn't depend on any Tamagui
 * responsive-variant class being generated.
 */
const Card = styled(YStack, {
  borderRadius: '$6',
  padding: '$5',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  animation: 'quick',
  enterStyle: { opacity: 0, y: 16 },
  hoverStyle: { y: -2 },
})

const Value = styled(SectionLabel, {
  tag: 'span',
  marginTop: '$2',
  fontFamily: fonts.display,
  fontSize: 30,
  fontWeight: '700',
  letterSpacing: 0,
  textTransform: 'none',
  opacity: 1,
  color: 'inherit',
})

export function StatsGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <Grid role="list" aria-label="Task statistics">
      {stats.map((s) => (
        <Card
          key={s.label}
          role="listitem"
          style={{ background: s.background, color: s.color, border: `1px solid ${s.border}` }}
        >
          <SectionLabel color="inherit" opacity={0.6}>{s.label}</SectionLabel>
          <Value>{s.value}</Value>
        </Card>
      ))}
    </Grid>
  )
}
