import React from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";

// App
import Nav from "../../components/Nav/Nav";

// Styles
import "./Header.scss";

type HeaderProps = {
  functions: {
    openMenu: () => void;
    closeMenu: () => void;
    userLogout: () => void;
  };
  menuOpen: boolean;
  user: {
    uid: string;
  };
};

const Header = ({
  functions: { openMenu, closeMenu, userLogout },
  menuOpen,
  user,
}: HeaderProps) => {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/">
          <div className="header__button header__logo">
            <img src="/favicon.ico" alt="Deck Checker" />
            <h1 className="header__title">Deck Checker</h1>
          </div>
        </Link>
        <button className="header__button header__hamburger" onClick={openMenu}>
          <MenuIcon />
        </button>
        {menuOpen && (
          <div className="header__container">
            <div className="header__inner">
              <button
                className="header__button header__close"
                onClick={closeMenu}
              >
                <CloseIcon />
              </button>
              <Nav functions={{ closeMenu, userLogout }} user={user} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
