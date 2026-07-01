import { useState } from 'react'
import { styled, Text, YStack } from 'tamagui'
import type { User } from './types'
import { orpc } from './api'
import { AppBackground } from './components/layout/AppBackground'
import { Surface } from './components/ui/Surface'
import { Title, Kicker } from './components/ui/Typography'
import { PrimaryButtonBlock } from './components/ui/Button'
import { TextInput, FieldLabel, WideField } from './components/ui/Input'
import { IconBadge } from './components/ui/IconBadge'
import { TaskIcon } from './components/icons'

interface LoginProps {
  onAuthenticated: (user: User) => void
}

const Screen = styled(YStack, {
  minHeight: '100vh',
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: '$4',
  paddingVertical: '$4',
  fontFamily: 'Inter, sans-serif',
})

const Card = styled(Surface, {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 384,
  padding: '$7',
  borderRadius: '$8',
  boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
  animation: 'quick',
  enterStyle: { opacity: 0, y: 16 },
})

const ErrorBox = styled(YStack, {
  marginBottom: '$5',
  paddingVertical: '$3',
  paddingHorizontal: '$4',
  borderRadius: '$4',
  background: '#fff',
})

const SwitchText = styled(Text, {
  marginTop: '$6',
  textAlign: 'center',
  color: '#9ca3af',
  fontSize: 14,
})

/**
 * Bare HTML <form>, declared with `tag: 'form'` baked into the styled()
 * config (same pattern as TaskForm.tsx's FormCard). Still used for
 * semantics + Enter-key submission, but the buttons below never rely on
 * the submit event alone — see note on PrimaryButtonBlock's onPress.
 */
const FormWrapper = styled(YStack, {
  tag: 'form',
  gap: '$4',
})

const LinkButton = styled(Text, {
  tag: 'button',
  borderWidth: 0,
  padding: 0,
  background: 'transparent',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: 14,
  hoverStyle: { textDecorationLine: 'underline' },
})

function Login({ onAuthenticated }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const user =
        mode === 'login'
          ? await orpc.auth.login({ email: email.trim(), password })
          : await orpc.auth.signup({ name: name.trim(), email: email.trim(), password })
      onAuthenticated(user)
    } catch (err) {
      console.error(`Failed to ${mode}:`, err)
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Screen>
      <AppBackground />

      <Card>
        <YStack alignItems="center" marginBottom="$7" gap="$3">
          <IconBadge size="sm" tone="light">
            <TaskIcon size={24} />
          </IconBadge>
          <YStack alignItems="center">
            <Title fontSize={20}>Task Manager</Title>
            <Kicker marginTop="$1">{mode === 'login' ? 'welcome back' : 'create your account'}</Kicker>
          </YStack>
        </YStack>

        {error && (
          <ErrorBox>
            <Text color="#000" fontFamily="Sora, sans-serif" fontSize={14} fontWeight="600">{error}</Text>
          </ErrorBox>
        )}

        <FormWrapper onSubmit={submit}>
          {mode === 'signup' && (
            <WideField>
              <FieldLabel>Name</FieldLabel>
              <TextInput type="text" required value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="Jane Doe" />
            </WideField>
          )}

          <WideField>
            <FieldLabel>Email</FieldLabel>
            <TextInput type="email" required value={email} onChange={(e) => setEmail(e.currentTarget.value)} placeholder="you@example.com" />
          </WideField>

          <WideField>
            <FieldLabel>Password</FieldLabel>
            <TextInput type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.currentTarget.value)} placeholder="••••••••" />
          </WideField>

          {/*
            onPress is the reliable trigger here — Tamagui's press handling
            on web doesn't always propagate a native submit through nested
            styled components the way a plain <button type="submit"> would.
            Calling submit() directly guarantees the click works regardless
            of how the surrounding <form> behaves, while type="submit" is
            kept so Enter-to-submit from the inputs still works too.
          */}
          <PrimaryButtonBlock tag="button" type="submit" disabled={submitting} marginTop="$2" onPress={submit}>
            {submitting ? (mode === 'login' ? 'Logging in...' : 'Creating account...') : mode === 'login' ? 'Log In' : 'Sign Up'}
          </PrimaryButtonBlock>
        </FormWrapper>

        <SwitchText>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <LinkButton
            tag="button"
            type="button"
            onPress={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError(null)
            }}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </LinkButton>
        </SwitchText>
      </Card>
    </Screen>
  )
}

export default Login
