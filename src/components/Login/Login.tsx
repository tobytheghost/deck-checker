import React from "react";
import { Button, Card } from "@material-ui/core";

// Styles
import "./Login.scss";

type LoginTypes = {
  functions: {
    loginUser: () => void;
  };
};

const Login = ({ functions: { loginUser } }: LoginTypes) => {
  return (
    <div className="login">
      <Card>
        <div className="login__container">
          <div className="login__text">
            <h1 className="login__title">Sign in</h1>
          </div>
          <Button
            type="submit"
            onClick={loginUser}
            variant="contained"
            color="primary"
          >
            Sign in with Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
