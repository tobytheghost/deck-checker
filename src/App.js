import React from "react";

// App
import Routes from "./Routes";
import { Login } from "./views";

// Styles
import "./App.scss";

function App() {
  //const [{ user }, dispatch] = useStateValue();
  const user = true;

  return <div className="app">{!user ? <Login /> : <Routes />}</div>;
}

export default App;
