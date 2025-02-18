import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// import { NextUIProvider } from '@nextui-org/react'
import { HeroUIProvider } from "@heroui/react";
import { Provider } from './components/ui/provider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <HeroUIProvider>
        <Provider>
          <App />
        </Provider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>
)
