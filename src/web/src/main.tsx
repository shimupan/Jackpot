import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Header, ProfileContextProvider } from './components.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProfileContextProvider>
         <Header />
         <App />
      </ProfileContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
