import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SunData from './components/SunData.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <SunData />
  </StrictMode>,
)
