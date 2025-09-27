import "./App.css";
import Navigation from "./components/navigation.component";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navigation />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
