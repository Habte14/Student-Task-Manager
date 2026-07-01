import { createTamagui } from 'tamagui'
import { createMedia } from '@tamagui/react-native-media-driver'
import { defaultConfig } from '@tamagui/config/v4'

/**
 * The app's responsive props ($gtXs, $gtSm, $gtMd — used for the stats
 * grid, the toolbar, and the sidebar's desktop/mobile switch) were
 * silently not being applied: the compiler produced no CSS for those
 * variants at all. That happens when a breakpoint key referenced in a
 * component isn't actually present in the active config's `media`
 * object — the variant is just skipped, no error.
 *
 * Defining the breakpoints explicitly here removes that ambiguity: these
 * exact keys are guaranteed to exist no matter what defaultConfig ships.
 */
const media = createMedia({
  xs: { maxWidth: 660 },
  gtXs: { minWidth: 660 + 1 },
  sm: { maxWidth: 860 },
  gtSm: { minWidth: 860 + 1 },
  md: { maxWidth: 980 },
  gtMd: { minWidth: 980 + 1 },
  lg: { maxWidth: 1280 },
  gtLg: { minWidth: 1280 + 1 },
})

export const tamaguiConfig = createTamagui({
  ...defaultConfig,
  media,
})

export default tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends typeof tamaguiConfig {}
}
