import { styled, XStack } from 'tamagui'
import type { FilterType } from '../../types'
import { Surface } from '../ui/Surface'
import { fonts, colors } from '../../theme/colors'
import { SearchIcon } from '../icons'

interface TaskToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  filter: FilterType
  onFilterChange: (value: FilterType) => void
}

const Toolbar = styled(XStack, { flexDirection: 'column', gap: '$3', $gtXs: { flexDirection: 'row' } })

const SearchWrap = styled(Surface, { flex: 1, position: 'relative', justifyContent: 'center', borderRadius: '$6' })

const SearchInput = styled('input', {
  width: '100%',
  paddingVertical: '$3',
  paddingLeft: 44,
  paddingRight: '$4',
  borderWidth: 0,
  outlineStyle: 'none',
  borderRadius: '$6',
  background: 'transparent',
  color: colors.textPrimary,
  fontFamily: fonts.body,
})

const FilterGroup = styled(Surface, { flexDirection: 'row', borderRadius: '$6', overflow: 'hidden' })

const FilterButton = styled(XStack, {
  tag: 'button',
  paddingVertical: '$3',
  paddingHorizontal: '$5',
  borderWidth: 0,
  cursor: 'pointer',
  fontFamily: fonts.ui,
  fontSize: 14,
  fontWeight: '700',
  textTransform: 'capitalize',
  animation: 'quick',
  variants: {
    active: {
      true: { background: '#fff', color: '#000' },
      false: { background: 'transparent', color: colors.textMuted, hoverStyle: { color: colors.textPrimary, background: colors.glassBgSoft } },
    },
  } as const,
})

const FILTERS: FilterType[] = ['all', 'pending', 'completed']

export function TaskToolbar({ search, onSearchChange, filter, onFilterChange }: TaskToolbarProps) {
  return (
    <Toolbar>
      <SearchWrap>
        <SearchIcon
          size={16}
          style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }}
        />
        <SearchInput
          value={search}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />
      </SearchWrap>
      <FilterGroup role="tablist" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <FilterButton key={f} active={filter === f} onPress={() => onFilterChange(f)} role="tab" aria-selected={filter === f}>
            {f}
          </FilterButton>
        ))}
      </FilterGroup>
    </Toolbar>
  )
}
