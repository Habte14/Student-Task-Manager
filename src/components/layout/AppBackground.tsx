import { styled, YStack, ZStack } from 'tamagui'
import { colors } from '../../theme/colors'

const BackgroundImage = styled(YStack, {
  position: 'fixed',
  inset: 0,
  backgroundImage: "url('/dashboard-bg.jpg')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
})

const Overlay = styled(YStack, {
  position: 'fixed',
  inset: 0,
  background: colors.overlayGradient,
})

const Glow = styled(YStack, {
  position: 'absolute',
  width: 384,
  height: 384,
  borderRadius: '$10',
  background: colors.glow,
  filter: 'blur(64px)',
})

/** Fixed full-viewport background image + dark overlay + two ambient glow blobs. */
export function AppBackground() {
  return (
    <ZStack position="fixed" inset={0} pointerEvents="none">
      <BackgroundImage />
      <Overlay />
      <YStack position="absolute" inset={0} overflow="hidden">
        <Glow style={{ top: -128, right: -128 }} />
        <Glow style={{ bottom: -128, left: -128 }} />
      </YStack>
    </ZStack>
  )
}
