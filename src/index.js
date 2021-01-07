import React from "react";
import ReactDOM from "react-dom";

// App
import App from "./App";
import reducer, { initialState } from "./context/Reducer";
import { StateProvider } from "./context/StateProvider";

// Styles
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <App />
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
