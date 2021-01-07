import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//App
// import { Header } from "./components";

const Routes = () => {
  return (
    <Router>
      {/* <Header></Header> */}
      <main>
        <Switch>
          {/* <Route exact path="/" component={Home} /> */}
          {/* <Route exact path="/login" component={Login} />
          <Route exact path="/search" component={SearchPage} />
          <Route exact path="/u/:userId" component={Profile} />
          <Route exact path="/d/:deckId" component={Deck} />
          <PrivateRoute exact path="/add-deck" component={Deck} />
          <Route exact path="/add-deck" component={Deck} />
          <Route component={Error} /> */}
        </Switch>
      </main>
    </Router>
  );
};

export default Routes;
