import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { Route, Routes } from "react-router-dom";
import DataScene from "./scenes/data";
import RadarScene from "./scenes/radar";
import { useMode, colorModeContext } from "./assets/theme";
import { WebSocketProvider } from "./scenes/test/websocket";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <colorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <WebSocketProvider>
              <Routes>
                <Route path="" element={<RadarScene />} />
                <Route path="/data" element={<DataScene />} />
              </Routes>
            </WebSocketProvider>
          </main>
        </div>
      </ThemeProvider>
    </colorModeContext.Provider>
  );
}

export default App;
