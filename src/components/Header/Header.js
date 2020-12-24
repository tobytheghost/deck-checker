import React from "react";

// App
import { Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider";

// Styles
import "./Header.scss";

function Header() {
  const [{ user }, dispatch] = useStateValue();

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
                <Link to={"/" + user.uid + "/decks"}>My Decks</Link>
              </li>
              <li className="header__item">
                <Link to="/profile">My Profile</Link>
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
