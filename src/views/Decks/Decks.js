import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { Link, useParams } from "react-router-dom";
import QRCode from "qrcode.react";

// Styles
import "./Decks.scss";

function Decks() {
  const [decks, setDecks] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(userId)
      .collection("decks")
      .onSnapshot((snapshot) => {
        console.log(snapshot.docs[0].data());
        setDecks(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="decks">
      <div className="decks__link">
        <QRCode value={window.location.href} />
      </div>
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
                src={deck.data.commander_image}
                alt={deck.data.commander}
              />
              {/* {deck.data.commander2 ? (
                <img
                  className="decks__commander decks__commander--commander2"
                  src={deck.data.image2}
                  alt={deck.data.commander2_name}
                />
              ) : (
                <></>
              )} */}
            </div>
          </Link>
          <div className="decks__score">Rating: {deck.data.deck_score}</div>
        </div>
      ))}
    </div>
  );
}

export default Decks;
