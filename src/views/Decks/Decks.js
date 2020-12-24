import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { Link } from "react-router-dom";

// Styles
import "./Decks.scss";

function Decks() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("decks").onSnapshot((snapshot) =>
      setDecks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="decks">
      {decks.map((deck) => (
        <div
          key={deck.id}
          className={
            "decks__deck " +
            (deck.data.commander2 ? "decks__deck--partner" : "")
          }
        >
          <Link to={"/deck/" + deck.data.deck_id}>
            <div className="deck__image">
              <img
                className="decks__commander"
                src={deck.data.image}
                alt={deck.data.commander_name}
              />
              {deck.data.commander2 ? (
                <img
                  className="decks__commander decks__commander--commander2"
                  src={deck.data.image2}
                  alt={deck.data.commander2_name}
                />
              ) : (
                <></>
              )}
            </div>
          </Link>
          <div className="decks__score">Rating: {deck.data.score}</div>
        </div>
      ))}
    </div>
  );
}

export default Decks;
