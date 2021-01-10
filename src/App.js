import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// App
import HeaderContainer from "./containers/HeaderContainer/HeaderContainer";
import HomeContainer from "./containers/HomeContainer/HomeContainer";
import ErrorContainer from "./containers/ErrorContainer/ErrorContainer";
import LoginContainer from "./containers/LoginContainer/LoginContainer";
import ProfileContainer from "./containers/ProfileContainer/ProfileContainer";
import DeckContainer from "./containers/DeckContainer/DeckContainer";

// Style
import "./App.scss";

function App() {
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: "#58a5f0",
        main: "#0277bd",
        dark: "#004c8c",
        contrastText: "#ffffff",
      },
      secondary: {
        light: "#5472d3",
        main: "#0d47a1",
        dark: "#002171",
        contrastText: "#ffffff",
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <div className="app">
        <Router>
          <HeaderContainer />
          <main>
            <Switch>
              <Route exact path="/" component={HomeContainer} />
              <Route exact path="/login" component={LoginContainer} />
              <Route exact path="/u/:userId" component={ProfileContainer} />
              <Route
                exact
                path="/d/:deckId"
                component={() => <DeckContainer isNewDeck={false} />}
              />
              <Route
                exact
                path="/add-deck"
                component={() => <DeckContainer isNewDeck={true} />}
              />
              {/* <Route exact path="/search" component={SearchPage} />
            <Route exact path="/add-deck" component={Deck} />*/}
              <Route component={() => <ErrorContainer errorCode={404} />} />
            </Switch>
          </main>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
