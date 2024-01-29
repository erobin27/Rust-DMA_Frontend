import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RadarScene from './scenes/radar/index.tsx'
import { WebSocketProvider } from './scenes/test/websocket.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WebSocketProvider>
      <RadarScene/>
    </WebSocketProvider>
  </React.StrictMode>,
)
