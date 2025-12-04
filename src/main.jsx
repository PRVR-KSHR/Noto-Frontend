// Silence console output in production for notoapp.tech domains (keeps console.error)
import './utils/silenceConsole.js'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { startKeepAlive } from './services/keepAliveService.js' // ✅ NEW: Keep-alive service

// ✅ NEW: Start keep-alive service to prevent Render backend sleep
startKeepAlive();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
