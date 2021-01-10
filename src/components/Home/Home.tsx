import React from "react";
import QRCode from "qrcode.react";
import { Link } from "react-router-dom";
import { Card } from "@material-ui/core";

// Styles
import "./Home.scss";

function Home() {
  return (
    <div className="home">
      <Card className="home__card">
        <div className="home__page">
          <div className="home__content">
            <h1 className="home__title">Deck Checker</h1>
            <p>By Toby Gates</p>
            <h2 className="home__subtitle">What is Deck Checker?</h2>
            <p>
              <strong>Deck Checker</strong> is an online tool for storing{" "}
              <strong>Edh / Commander</strong> deck lists.{" "}
              <strong>Deck Checker</strong> was designed as a way for players to
              be able to easily 'rate' each other's decks based on power levels
              to produce a more accurate power level system and to create more
              balanced games.
            </p>
            <p>
              <strong>Edh / Commander</strong> power levels can be quite
              subjective and players can easily under / over estimate the power
              level of their deck. <strong>Deck Checker</strong> aims to solve
              this by comparing ratings from lots of players to produce a more
              balanced rating.
            </p>
            <p>
              <strong>Deck Checker</strong> automatically generates QR codes
              which can be scanned to allow for easy access to the deck list as
              well as to allow other players to be able to rate your deck.
            </p>
            <p>Example QR code:</p>
            <p>
              <QRCode
                value={window.location.href + "/d/nzuxEFJBux5nqfvIXuWo"}
              />
            </p>
          </div>
        </div>
      </Card>
      <Card className="home__card">
        <div className="home__page">
          <div className="home__content">
            <h2 className="home__subtitle">How do I use Deck Checker?</h2>
            <p>
              Using <strong>Deck Checker</strong> is easy:
            </p>
            <ol>
              <li>
                Sign Up / Login to <strong>Deck Checker</strong>{" "}
                <Link to="/login">here</Link> using your{" "}
                <strong>Google account</strong>.
              </li>
              <li>
                Create a <strong>new deck</strong> using the 'Add New Deck'
                button on the <strong>Profile</strong> page.
              </li>
              <li>
                Using the <strong>search</strong> bar, add cards to the newly
                created deck.
              </li>
              <li>
                Save the deck and download the <strong>QR code</strong>{" "}
                generated for the deck.
              </li>
            </ol>
            <p>
              Once you have created a deck and have the QR code, you can share
              the deck's unique link with your friends or keep the QR code
              somewhere handy so that other players can easily scan it to be
              able to rate your deck.
            </p>
            <p>
              <img src="/deckbox.jpg" alt="Deckbox with QR code" />
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Home;
