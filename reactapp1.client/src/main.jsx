import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css' //Te itten nekem ne rond�ts a k�d j� l�gyszi k�szike
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
