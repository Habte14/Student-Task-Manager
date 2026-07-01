import { styled, YStack } from 'tamagui'
import type { ReactNode } from 'react'
import type { User } from '../../types'
import { SIDEBAR_WIDTH } from '../../theme/colors'
import { AppBackground } from './AppBackground'
import { Sidebar } from './Sidebar'

const Screen = styled(YStack, {
  minHeight: '100vh',
  position: 'relative',
  fontFamily: 'Inter, sans-serif',
})

const ContentColumn = styled(YStack, {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 1100,
  paddingVertical: '$6',
  paddingHorizontal: '$4',
  gap: '$6',
  $gtMd: {
    marginLeft: SIDEBAR_WIDTH,
    paddingHorizontal: '$7',
    paddingVertical: '$8',
  },
})

interface AppShellProps {
  user: User
  onLogout: () => void
  sidebarOpen: boolean
  onCloseSidebar: () => void
  children: ReactNode
}

/**
 * Top-level authenticated layout: fixed background, fixed sidebar
 * (desktop) / drawer (mobile), and a single content column offset to
 * clear the sidebar on desktop. All page content renders as children so
 * this stays a pure layout component with no task/business logic.
 */
export function AppShell({ user, onLogout, sidebarOpen, onCloseSidebar, children }: AppShellProps) {
  return (
    <Screen>
      <AppBackground />
      <Sidebar user={user} onLogout={onLogout} open={sidebarOpen} onClose={onCloseSidebar} />
      <ContentColumn>
        {children}
      </ContentColumn>
    </Screen>
  )
}
