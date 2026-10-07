import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.jsx'
import RemindersProvider from './context/RemindersProvider'
import ThemeProvider from './context/ThemeProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RemindersProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RemindersProvider>
    </ThemeProvider>
  </StrictMode>,
)
