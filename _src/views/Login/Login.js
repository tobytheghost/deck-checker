import React from "react";

// App
import { auth, provider } from "../../firebase";
import { actionTypes } from "../../Reducer";
import { useStateValue } from "../../StateProvider";
import { Redirect } from "react-router-dom";

// Styles
import { Button, Card } from "@material-ui/core";
import "./Login.scss";

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
      {user ? <Redirect to={"/u/" + user.uid} /> : <></>}
      <div className="login">
        <Card>
          <div className="login__container">
            <div className="login__text">
              <h1 className="login__title">Sign in</h1>
            </div>
            <Button
              type="submit"
              onClick={signIn}
              variant="contained"
              color="primary"
            >
              Sign in with Google
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
export default Login;
