import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css' //Te itten nekem ne rondíts a kód jó légyszi köszike
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
