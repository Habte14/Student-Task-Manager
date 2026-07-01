import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TamaguiProvider } from 'tamagui'
import App from './App'
import tamaguiConfig from './tamagui.config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <App />
    </TamaguiProvider>
  </StrictMode>,
)
