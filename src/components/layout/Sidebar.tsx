import { styled, XStack, YStack, Text } from 'tamagui'
import type { User } from '../../types'
import { colors, fonts, SIDEBAR_WIDTH } from '../../theme/colors'
import { Surface } from '../ui/Surface'
import { Title, Kicker, SectionLabel } from '../ui/Typography'
import { GhostButton } from '../ui/Button'
import { IconBadge } from '../ui/IconBadge'
import { TaskIcon, GridIcon, LogoutIcon, CloseIcon } from '../icons'

interface SidebarProps {
  user: User
  onLogout: () => void
  /** Mobile drawer open state. Ignored on $gtMd, where the sidebar is always visible. */
  open: boolean
  onClose: () => void
}

const SidebarPanel = styled(Surface, {
  width: SIDEBAR_WIDTH,
  height: '100%',
  paddingVertical: '$5',
  paddingHorizontal: '$4',
  gap: '$5',
  borderTopWidth: 0,
  borderBottomWidth: 0,
  borderLeftWidth: 0,
})

const DesktopSidebar = styled(YStack, {
  display: 'none',
  $gtMd: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    width: SIDEBAR_WIDTH,
  },
})

const Backdrop = styled(YStack, {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  zIndex: 19,
  animation: 'quick',
  enterStyle: { opacity: 0 },
  $gtMd: { display: 'none' },
})

const MobileDrawer = styled(YStack, {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  zIndex: 20,
  width: SIDEBAR_WIDTH,
  animation: 'quick',
  enterStyle: { opacity: 0, x: -16 },
  $gtMd: { display: 'none' },
})

const NavItem = styled(XStack, {
  alignItems: 'center',
  gap: '$3',
  paddingVertical: '$2.5',
  paddingHorizontal: '$3',
  borderRadius: '$4',
  background: '#fff',
  color: '#000',
  fontFamily: fonts.ui,
  fontSize: 14,
  fontWeight: '700',
})

const Avatar = styled(XStack, {
  width: 36,
  height: 36,
  borderRadius: '$10',
  alignItems: 'center',
  justifyContent: 'center',
  background: colors.glassBgSoft,
  borderWidth: 1,
  borderColor: colors.glassBorder,
  flexShrink: 0,
})

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?'
}

function SidebarContent({ user, onLogout, onClose }: { user: User; onLogout: () => void; onClose?: () => void }) {
  return (
    <SidebarPanel>
      <XStack alignItems="center" gap="$3">
        <IconBadge>
          <TaskIcon size={20} />
        </IconBadge>
        <YStack flex={1} minWidth={0}>
          <Title fontSize={17}>Task Manager</Title>
          <Kicker>stay organized</Kicker>
        </YStack>
        {onClose && (
          <GhostButton onPress={onClose} aria-label="Close menu">
            <CloseIcon size={16} />
          </GhostButton>
        )}
      </XStack>

      <YStack height={1} background={colors.glassBorder} />

      <YStack gap="$2">
        <SectionLabel paddingHorizontal="$2">Menu</SectionLabel>
        <NavItem>
          <GridIcon size={16} />
          <Text color="inherit" fontFamily={fonts.ui} fontSize={14} fontWeight="700">Dashboard</Text>
        </NavItem>
      </YStack>

      <YStack flex={1} />

      <YStack gap="$3">
        <YStack height={1} background={colors.glassBorder} />
        <XStack alignItems="center" gap="$3">
          <Avatar>
            <Kicker fontSize={12} letterSpacing={0} color={colors.textPrimary}>
              {initials(user.name)}
            </Kicker>
          </Avatar>
          <YStack flex={1} minWidth={0}>
            <Title fontSize={13} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</Title>
            <Kicker fontSize={10} letterSpacing={0.5} textTransform="none" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </Kicker>
          </YStack>
          <GhostButton onPress={onLogout} aria-label="Log out" title="Log out">
            <LogoutIcon size={16} />
          </GhostButton>
        </XStack>
      </YStack>
    </SidebarPanel>
  )
}

/**
 * App navigation. Renders as a fixed, always-visible column on desktop
 * ($gtMd and up) and as a slide-in drawer with backdrop on smaller
 * screens, controlled by `open`/`onClose`. Both share the same content so
 * brand, nav and the user/logout footer never go out of sync.
 */
export function Sidebar({ user, onLogout, open, onClose }: SidebarProps) {
  return (
    <>
      <DesktopSidebar>
        <SidebarContent user={user} onLogout={onLogout} />
      </DesktopSidebar>

      {open && (
        <>
          <Backdrop onPress={onClose} />
          <MobileDrawer>
            <SidebarContent user={user} onLogout={onLogout} onClose={onClose} />
          </MobileDrawer>
        </>
      )}
    </>
  )
}
