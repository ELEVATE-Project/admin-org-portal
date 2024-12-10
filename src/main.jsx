// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
//import "./styles/global.css"; // Import global styles here
import './index.css' // Import global styles here
import { Toaster } from './components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">*/}
    <Toaster />
    <App />
    {/* </ThemeProvider> */}
  </React.StrictMode>,
)
