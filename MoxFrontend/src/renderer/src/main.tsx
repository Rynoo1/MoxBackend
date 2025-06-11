import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './App'
import './i18n'

const savedFontSize = localStorage.getItem('fontSize') || 'normal'
const root = document.documentElement

switch (savedFontSize) {
  case 'large':
    root.style.fontSize = '18px'
    break
  case 'xl':
    root.style.fontSize = '20px'
    break
  default:
    root.style.fontSize = '16px'
    break
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
