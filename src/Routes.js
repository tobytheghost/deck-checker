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
          {/* <Route exact Path="/:userId" component={User} /> */}
          <Route exact path="/:userId/decks" component={Decks} />
          <Route path="/:userId/decks/:deckId" component={Deck} />
          <Route component={Error} />
        </Switch>
      </main>
    </Router>
  );
}

export default Routes;
