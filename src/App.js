import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// App
import HeaderContainer from "./containers/HeaderContainer/HeaderContainer";
import HomeContainer from "./containers/HomeContainer/HomeContainer";
import ErrorContainer from "./containers/ErrorContainer/ErrorContainer";
import LoginContainer from "./containers/LoginContainer/LoginContainer";
import ProfileContainer from "./containers/ProfileContainer/ProfileContainer";

// Style
import "./App.scss";

function App() {
  return (
    <div className="app">
      <Router>
        <HeaderContainer />
        <main>
          <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route exact path="/login" component={LoginContainer} />
            <Route exact path="/u/:userId" component={ProfileContainer} />
            {/* <Route exact path="/search" component={SearchPage} />
          <Route exact path="/u/:userId" component={Profile} />
          <Route exact path="/d/:deckId" component={Deck} />
          <PrivateRoute exact path="/add-deck" component={Deck} />
          <Route exact path="/add-deck" component={Deck} />*/}
            <Route component={() => <ErrorContainer errorCode={404} />} />
          </Switch>
        </main>
      </Router>
    </div>
  );
}

export default App;
