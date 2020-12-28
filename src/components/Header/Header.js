import React from "react";

// App
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";

// Styles
import "./Header.scss";

function Header() {
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();

  return (
    <header className="header">
      <nav className="header__nav">
        <ul className="header__menu">
          <li className="header__item">
            <Link to="/">Home</Link>
          </li>
          <li className="header__item">
            <Link to="/search">Search</Link>
          </li>
          {user != null ? (
            <>
              <li className="header__item">
                <Link to={"/u/" + user.uid}>My Profile</Link>
              </li>
              <li className="header__item">
                <button
                  onClick={() => {
                    dispatch({
                      type: actionTypes.SET_USER,
                      user: null,
                    });
                    localStorage.setItem("authUser", null);
                    history.push("/");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <></>
          )}
          {!user ? (
            <>
              <li className="header__item">
                <Link to={"/login"}>Login</Link>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
