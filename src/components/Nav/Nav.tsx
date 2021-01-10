import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";

// App

// Styles
import "./Nav.scss";

type NavProps = {
  functions: {
    closeMenu: () => void;
    userLogout: () => void;
  };
  user: {
    uid: string;
  };
};

const Nav = ({ functions: { closeMenu, userLogout }, user }: NavProps) => {
  return (
    <nav className="nav">
      <ul className="nav__menu">
        <li className="nav__item">
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        {/* <li className="nav__item">
          <Link to="/search" onClick={closeMenu}>
            Search
          </Link>
        </li> */}
        {user != null && (
          <>
            <li className="nav__item">
              <Link to={"/u/" + user.uid} onClick={closeMenu}>
                My Profile
              </Link>
            </li>
            <li className="nav__item nav__item--logout">
              <Button
                variant="outlined"
                onClick={() => {
                  userLogout();
                  closeMenu();
                }}
              >
                Logout
              </Button>
            </li>
          </>
        )}
        {!user && (
          <>
            <li className="nav__item">
              <Link to={"/login"} onClick={closeMenu}>
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
