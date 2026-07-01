import { styled, XStack } from 'tamagui'

/**
 * Square badge that centers an icon. Used for the brand mark (sidebar,
 * login screen) and the empty-state illustration — previously these reused
 * a single "Logo" component by overriding half its props at the call site,
 * which is what let the brand mark and the empty-state icon drift out of
 * sync. Now they share one explicit, sizeable component.
 */
export const IconBadge = styled(XStack, {
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 40,
  height: 40,
  borderRadius: '$4',
  background: '#fff',
  color: '#000',

  variants: {
    size: {
      sm: { width: 40, height: 40, borderRadius: '$4' },
      lg: { width: 80, height: 80, borderRadius: '$8' },
    },
    tone: {
      light: { background: '#fff', color: '#000' },
      muted: { background: 'rgba(255,255,255,0.1)', color: '#6b7280', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    },
  } as const,

  defaultVariants: {
    size: 'sm',
    tone: 'light',
  },
})
