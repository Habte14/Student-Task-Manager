import { useState } from 'react'
import { styled, YStack } from 'tamagui'
import { useAuth } from './hooks/useAuth'
import { useTasks } from './hooks/useTasks'
import { AppShell } from './components/layout/AppShell'
import { PageHeader } from './components/layout/PageHeader'
import { StatsGrid, type StatCardData } from './components/dashboard/StatsGrid'
import { ErrorAlert } from './components/dashboard/ErrorAlert'
import { TaskForm } from './components/dashboard/TaskForm'
import { TaskToolbar } from './components/dashboard/TaskToolbar'
import { TaskList } from './components/dashboard/TaskList'
import { EmptyState } from './components/dashboard/EmptyState'
import { Kicker } from './components/ui/Typography'
import Login from './Login'

const LoadingScreen = styled(YStack, {
  minHeight: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#000',
})

function App() {
  const { user, setUser, authChecked, logout } = useAuth()
  const {
    tasks,
    stats,
    filter,
    setFilter,
    search,
    setSearch,
    error,
    setError,
    addTask,
    toggleComplete,
    deleteTask,
    resetTasks,
  } = useTasks(user)

  const [showForm, setShowForm] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout(resetTasks)
  }

  if (!authChecked) {
    return (
      <LoadingScreen>
        <Kicker>Loading...</Kicker>
      </LoadingScreen>
    )
  }

  if (!user) return <Login onAuthenticated={setUser} />

  const statCards: StatCardData[] = [
    { label: 'Total Tasks', value: stats.total, background: 'rgba(0,0,0,0.8)', color: '#fff', border: 'rgba(255,255,255,0.1)' },
    { label: 'Pending', value: stats.pending, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'rgba(255,255,255,0.1)' },
    { label: 'Completed', value: stats.completed, background: '#fff', color: '#000', border: '#fff' },
    { label: 'High Priority', value: stats.high, background: 'rgba(0,0,0,0.8)', color: '#fff', border: 'rgba(255,255,255,0.1)' },
  ]

  return (
    <AppShell user={user} onLogout={handleLogout} sidebarOpen={sidebarOpen} onCloseSidebar={() => setSidebarOpen(false)}>
      <PageHeader showForm={showForm} onToggleForm={() => setShowForm((s) => !s)} onMenuPress={() => setSidebarOpen(true)} />

      <StatsGrid stats={statCards} />

      {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}

      {showForm && <TaskForm onSubmit={addTask} onClose={() => setShowForm(false)} />}

      <TaskToolbar search={search} onSearchChange={setSearch} filter={filter} onFilterChange={setFilter} />

      {tasks.length === 0 ? (
        <EmptyState hasAnyTasks={stats.total > 0} />
      ) : (
        <TaskList tasks={tasks} onToggle={toggleComplete} onDelete={deleteTask} />
      )}
    </AppShell>
  )
}

export default App
