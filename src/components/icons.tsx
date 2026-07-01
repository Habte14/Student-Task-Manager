/**
 * Small inline icon set. Centralizing these avoids the same <svg> markup
 * being copy-pasted (slightly differently) across the header, sidebar,
 * task cards and empty state, which was part of the original drift in
 * spacing/sizing between icons.
 */
import type { ComponentProps, ReactNode } from 'react'

type IconProps = ComponentProps<'svg'> & { size?: number }

function BaseIcon({ size = 16, children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function TaskIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </BaseIcon>
  )
}

export function PlusIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2.5}>
      <path d="M12 4v16m8-8H4" />
    </BaseIcon>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2.5}>
      <path d="M6 18L18 6M6 6l12 12" />
    </BaseIcon>
  )
}

export function LogoutIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </BaseIcon>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </BaseIcon>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </BaseIcon>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </BaseIcon>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 3} stroke={props.stroke ?? '#000'}>
      <path d="M5 13l4 4L19 7" />
    </BaseIcon>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </BaseIcon>
  )
}

export function GridIcon(props: IconProps) {
  return (
    <BaseIcon {...props} strokeWidth={props.strokeWidth ?? 2}>
      <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
    </BaseIcon>
  )
}
