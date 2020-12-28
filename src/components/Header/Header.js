import React, { useState } from "react";

// App
import { Link, useHistory } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";

// Styles
import { Button } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import "./Header.scss";

function Header() {
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();

  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <button className="header__button header__hamburger" onClick={openMenu}>
        <MenuIcon />
      </button>
      {menuOpen ? (
        <div className="header__container">
          <button className="header__button header__close" onClick={closeMenu}>
            <CloseIcon />
          </button>
          <nav className="header__nav">
            <ul className="header__menu">
              <li className="header__item">
                <Link to="/" onClick={closeMenu}>
                  Home
                </Link>
              </li>
              <li className="header__item">
                <Link to="/search" onClick={closeMenu}>
                  Search
                </Link>
              </li>
              {user != null ? (
                <>
                  <li className="header__item">
                    <Link to={"/u/" + user.uid} onClick={closeMenu}>
                      My Profile
                    </Link>
                  </li>
                  <li className="header__item header__item--logout">
                    <Button
                      variant="outlined"
                      onClick={() => {
                        dispatch({
                          type: actionTypes.SET_USER,
                          user: null,
                        });
                        localStorage.setItem("authUser", null);
                        closeMenu();
                        history.push("/");
                      }}
                    >
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <></>
              )}
              {!user ? (
                <>
                  <li className="header__item">
                    <Link to={"/login"} onClick={closeMenu}>
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <></>
              )}
            </ul>
          </nav>
        </div>
      ) : (
        <></>
      )}
    </header>
  );
}

export default Header;
