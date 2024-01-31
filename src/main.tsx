import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { WebSocketProvider } from "./scenes/test/websocket.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataScene from "./scenes/data/index.tsx";
import RadarScene from "./scenes/radar/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WebSocketProvider>
        <Routes>
          <Route path="/" element={<RadarScene />} />
          <Route path="/data" element={<DataScene />} />
        </Routes>
      </WebSocketProvider>
    </BrowserRouter>
  </React.StrictMode>
);
