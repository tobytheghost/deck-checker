import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// App
import Header from "../../components/Header/Header";
import { useGlobalState } from "../../context/GlobalStateProvider";
import { logout } from "../../helpers/auth";

const HeaderContainer = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [{ user }, globalDispatch] = useGlobalState();
  const history = useHistory();

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const userLogout = () => {
    logout(globalDispatch);
    history.push("/");
  };

  return (
    <Header
      functions={{ openMenu, closeMenu, userLogout }}
      menuOpen={menuOpen}
      user={user}
    ></Header>
  );
};

export default HeaderContainer;
