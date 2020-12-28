import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { QR } from "../../components";
import { useStateValue } from "../../StateProvider";

// Styles
import { Card, Button } from "@material-ui/core";
import "./Profile.scss";

function Profile() {
  const [{ user }, dispatch] = useStateValue();
  const [decks, setDecks] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(userId)
      .collection("decks")
      .onSnapshot((snapshot) => {
        setDecks(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    if (user && userId === user.uid) {
      setCanEdit(true);
    }

    return () => {
      unsubscribe();
    };
  }, [userId, user]);

  return (
    <div className="profile">
      {canEdit ? (
        <section className="profile__actions">
          <Card>
            <ul>
              <li className="profile__action">
                <Button variant="contained" color="primary">
                  <Link to="/add-deck">Add New Deck</Link>
                </Button>
              </li>
            </ul>
          </Card>
        </section>
      ) : (
        <></>
      )}
      <section className="profile__decks">
        {decks.map((deck) => (
          <Card key={deck.id}>
            <div
              className={
                "profile__deck " +
                (deck.data.commander2 ? "profile__deck--partner" : "")
              }
            >
              <h2 className="profile__name">{deck.data.deck_name}</h2>
              <Link to={`/d/${deck.id}`}>
                <div className="profile__image">
                  <img
                    className="profile__commander"
                    src={deck.data.commander_image}
                    alt={deck.data.commander_name}
                  />
                </div>
              </Link>
              {/* <div className="profile__score">
                Rating: {deck.data.deck_score}
              </div> */}
            </div>
          </Card>
        ))}
      </section>
      {canEdit ? (
        <section className="profile__info">
          <div className="profile__link">
            <QR imageName={userId} qrTitle="Profile QR Code"></QR>
          </div>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Profile;
