import React from "react";

// App
import { auth, provider } from "../../firebase";
import { actionTypes } from "../../Reducer";
import { useStateValue } from "../../StateProvider";

// Styles
import { Button } from "@material-ui/core";

function Login() {
  // eslint-disable-next-line
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
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
  );
}
export default Login;
