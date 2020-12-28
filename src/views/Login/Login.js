import React from "react";

// App
import { auth, provider } from "../../firebase";
import { actionTypes } from "../../Reducer";
import { useStateValue } from "../../StateProvider";
import { Redirect } from "react-router-dom";

// Styles
import { Button } from "@material-ui/core";

function Login() {
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
        localStorage.setItem("authUser", JSON.stringify(result.user));
      })
      .catch((error) => alert(error.message));
  };

  return (
    <>
      {user ? <Redirect to="/" /> : <></>}
      <main>
        <div className="login">
          <div className="login__container">
            <div className="login__text">
              <h1>Sign in</h1>
            </div>
            <Button type="submit" onClick={signIn}>
              Sign in with Google
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
export default Login;
