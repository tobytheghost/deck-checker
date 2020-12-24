import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//App
import { Error, Home, Deck, Decks, SearchPage } from "./views";
import { Header } from "./components";

function Routes() {
  return (
    <Router>
      <Header></Header>
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/search" component={SearchPage} />
          <Route exact path="/decks" component={Decks} />
          <Route path="/decks/:deckId" component={Deck} />
          <Route component={Error} />
        </Switch>
      </main>
    </Router>
  );
}

export default Routes;
