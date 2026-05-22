import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AppProvider } from './context/AppContext'
import { PlayerProvider } from './context/PlayerContext'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <PlayerProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2800,
              style: {
                background: 'rgba(15,15,35,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(155,93,229,0.25)',
                color: '#f0f0ff',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '15px',
                fontWeight: '500',
                letterSpacing: '0.5px',
                borderRadius: '12px',
                padding: '12px 18px',
              },
              success: { iconTheme: { primary: '#06ffa5', secondary: '#04040d' } },
              error: { iconTheme: { primary: '#f72585', secondary: '#04040d' } },
            }}
          />
        </PlayerProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
