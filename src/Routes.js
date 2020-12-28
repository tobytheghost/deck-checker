import React from "react";

//App
import {
  Error,
  Home,
  Deck,
  Profile,
  SearchPage,
  EditDeck,
  Login,
} from "./views";
import { Header } from "./components";
import { useStateValue } from "./StateProvider";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function PrivateRoute({ component: Component, ...rest }) {
  const [{ user }, dispatch] = useStateValue();
  return (
    <Route
      {...rest}
      render={(props) => (user ? <Component {...props} /> : <Login />)}
    />
  );
}

function Routes() {
  return (
    <Router>
      <Header></Header>
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/search" component={SearchPage} />
          <Route exact path="/u/:userId" component={Profile} />
          <Route exact path="/d/:deckId" component={Deck} />
          <PrivateRoute exact path="/add-deck" component={EditDeck} />
          <Route component={Error} />
        </Switch>
      </main>
    </Router>
  );
}

export default Routes;
