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
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();
  const [decks, setDecks] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    const unsubscribe = db
      // .collection("users")
      // .doc(userId)
      .collection("decks")
      .where("user_id", "==", userId)
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
      {!decks.length ? (
        <section className="profile__decks">
          <Card>
            <div className="profile__decks-wrapper profile__decks-wrapper--top">
              <h2 className="profile__subtitle">Decks:</h2>
              {canEdit ? (
                <Button variant="contained" color="primary">
                  <Link to="/add-deck">Add New Deck</Link>
                </Button>
              ) : (
                <></>
              )}
            </div>
            <div className="profile__decks-wrapper profile__decks-wrapper--bottom">
              Nothing to see here ...
            </div>
          </Card>
        </section>
      ) : (
        <section className="profile__decks">
          <Card>
            <div className="profile__decks-wrapper profile__decks-wrapper--top">
              <h2 className="profile__subtitle">Decks:</h2>
              {canEdit ? (
                <Button variant="contained" color="primary">
                  <Link to="/add-deck">Add New Deck</Link>
                </Button>
              ) : (
                <></>
              )}
            </div>
            <div className="profile__decks-wrapper">
              {decks
                .sort(
                  (b, a) => a.data.timestamp.seconds - b.data.timestamp.seconds
                )
                .map((deck) => (
                  <div
                    className="profile__deck-wrapper"
                    key={deck.data.timestamp.seconds}
                  >
                    <Card variant="outlined" className="profile__card">
                      <div
                        className={
                          "profile__deck " +
                          (deck.data.commander2 ? "profile__deck--partner" : "")
                        }
                      >
                        <h2 className="profile__name">{deck.data.deck_name}</h2>
                        <div className="profile__date">
                          Last updated:{" "}
                          {deck.data.timestamp.toDate().toDateString()}
                        </div>
                        <Link to={`/d/${deck.id}`}>
                          <div className="profile__image">
                            <img
                              width="488"
                              key={deck.data.timestamp.seconds}
                              className="profile__commander"
                              src={
                                deck.data.commander_image
                                  ? deck.data.commander_image
                                  : "/card_back.jpg"
                              }
                              alt={
                                deck.data.commander_name
                                  ? deck.data.commander_name
                                  : deck.data.deck_name
                              }
                            />
                          </div>
                        </Link>
                        {/* <div className="profile__score">
                Rating: {deck.data.deck_score}
              </div> */}
                      </div>
                    </Card>
                  </div>
                ))}
            </div>
          </Card>
        </section>
      )}
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
