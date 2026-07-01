import { useState } from 'react'
import { styled, XStack, YStack } from 'tamagui'
import type { Priority } from '../../types'
import { Surface } from '../ui/Surface'
import { Title } from '../ui/Typography'
import { PrimaryButton, OutlineButton } from '../ui/Button'
import { TextInput, TextArea, Select, FieldLabel, Field, WideField } from '../ui/Input'

export interface NewTaskInput {
  title: string
  description: string
  priority: Priority
  dueDate: string
}

interface TaskFormProps {
  onSubmit: (input: NewTaskInput) => Promise<boolean>
  onClose: () => void
}

const FormCard = styled(Surface, {
  tag: 'form',
  borderRadius: '$8',
  padding: '$7',
  gap: '$5',
  boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
  animation: 'bouncy',
  enterStyle: { opacity: 0, y: 16, scale: 0.98 },
})

const FormGrid = styled(XStack, { flexWrap: 'wrap', gap: '$4' })

/**
 * Self-contained "create task" form. Owns its own field/submitting state
 * and only hands a finished, trimmed payload up via onSubmit — the parent
 * doesn't need to know about individual fields, just whether a task was
 * created.
 */
export function TaskForm({ onSubmit, onClose }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [dueDate, setDueDate] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e?: { preventDefault?: () => void }) => {
    e?.preventDefault?.()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    const ok = await onSubmit({ title: title.trim(), description: description.trim(), priority, dueDate })
    if (ok) {
      setTitle('')
      setDescription('')
      setPriority('Medium')
      setDueDate('')
      onClose()
    }
    setSubmitting(false)
  }

  return (
    <FormCard onSubmit={handleSubmit}>
      <XStack alignItems="center" gap="$3">
        <YStack width={6} height={28} borderRadius="$10" background="#fff" />
        <Title fontSize={18}>Create New Task</Title>
      </XStack>

      <FormGrid>
        <WideField>
          <FieldLabel>Title *</FieldLabel>
          <TextInput value={title} onChange={(e) => setTitle(e.currentTarget.value)} placeholder="e.g. Finish Math Assignment" required />
        </WideField>
        <WideField>
          <FieldLabel>Description</FieldLabel>
          <TextArea value={description} onChange={(e) => setDescription(e.currentTarget.value)} placeholder="Add details about this task..." rows={2} />
        </WideField>
        <Field>
          <FieldLabel>Priority</FieldLabel>
          <Select value={priority} onChange={(e) => setPriority(e.currentTarget.value as Priority)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Due Date</FieldLabel>
          <TextInput type="date" value={dueDate} onChange={(e) => setDueDate(e.currentTarget.value)} style={{ colorScheme: 'dark' }} />
        </Field>
      </FormGrid>

      <XStack justifyContent="flex-end" gap="$3" flexWrap="wrap">
        <OutlineButton tag="button" type="button" onPress={onClose}>
          Cancel
        </OutlineButton>
        <PrimaryButton tag="button" type="submit" disabled={submitting} onPress={handleSubmit}>
          {submitting ? 'Adding...' : 'Add Task'}
        </PrimaryButton>
      </XStack>
    </FormCard>
  )
}
