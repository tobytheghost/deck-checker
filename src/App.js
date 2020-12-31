import React from "react";

// App
import Routes from "./Routes";
// import { Login } from "./views";
//import { auth } from "./firebase";
// import { useStateValue } from "./StateProvider";

// Styles
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./App.scss";

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#58a5f0",
        main: "#0277bd",
        dark: "#004c8c",
        contrastText: "#ffffff",
      },
      secondary: {
        light: "#5472d3",
        main: "#0d47a1",
        dark: "#002171",
        contrastText: "#ffffff",
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <div className="app">
        <Routes />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
