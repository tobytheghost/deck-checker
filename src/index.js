import React from "react";
import ReactDOM from "react-dom";

// App
import App from "./App";
import globalReducer, { initialGlobalState } from "./context/GlobalReducer";
import { GlobalStateProvider } from "./context/GlobalStateProvider";

// Styles
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <GlobalStateProvider
      initialState={initialGlobalState}
      reducer={globalReducer}
    >
      <App />
    </GlobalStateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
