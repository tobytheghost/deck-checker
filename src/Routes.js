import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//App
import { Error, Home, Deck, Profile, SearchPage, EditDeck } from "./views";
import { Header } from "./components";

function Routes() {
  return (
    <Router>
      <Header></Header>
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={SearchPage} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/u/:userId" component={Profile} />
          <Route exact path="/d/:deckId" component={Deck} />
          <Route exact path="/add-deck" component={EditDeck} />
          <Route component={Error} />
        </Switch>
      </main>
    </Router>
  );
}

export default Routes;
