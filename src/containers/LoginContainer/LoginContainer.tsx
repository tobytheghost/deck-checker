import React from "react";
import { Redirect } from "react-router-dom";

// App
import Login from "../../components/Login/Login";
import { useGlobalState } from "../../context/GlobalStateProvider";
import { login } from "../../helpers/auth";

function LoginContainer() {
  const [{ user }, globalDispatch] = useGlobalState();

  const loginUser = () => {
    login(globalDispatch);
  };

  if (user) {
    return <Redirect to={"/u/" + user.uid} />;
  }

  return <Login functions={{ loginUser }} />;
}
export default LoginContainer;
