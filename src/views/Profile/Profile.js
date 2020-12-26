import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { QR } from "../../components";

// Styles
import { Card, Button } from "@material-ui/core";
import "./Profile.scss";

function Profile() {
  const [decks, setDecks] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(userId)
      .collection("decks")
      .onSnapshot((snapshot) => {
        //console.log(snapshot.docs[0].data());
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
  }, [userId]);

  return (
    <div className="profile">
      <section className="profile__actions">
        <Card>
          <ul>
            <li className="profile__action">
              <Button variant="contained" color="primary">
                Add New Deck
              </Button>
            </li>
          </ul>
        </Card>
      </section>
      <section className="profile__decks">
        {decks.map((deck) => (
          <Card key={deck.id}>
            <div
              className={
                "profile__deck " +
                (deck.data.commander2 ? "profile__deck--partner" : "")
              }
            >
              <h2 className="profile__name">{deck.data.commander}</h2>
              <Link to={`/${userId}/deck/${deck.id}`}>
                <div className="profile__image">
                  <img
                    className="profile__commander"
                    src={deck.data.commander_image}
                    alt={deck.data.commander}
                  />
                </div>
              </Link>
              <div className="profile__score">
                Rating: {deck.data.deck_score}
              </div>
            </div>
          </Card>
        ))}
      </section>
      <section className="profile__info">
        <div className="profile__link">
          <QR imageName={userId} qrTitle="Profile QR Code"></QR>
        </div>
      </section>
    </div>
  );
}

export default Profile;
