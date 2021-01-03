import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { QR } from "../../components";
import { useStateValue } from "../../StateProvider";
import { setRating } from "../../helpers";

// Styles
import { Card, Button /*, Snackbar*/ } from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
// import MuiAlert from "@material-ui/lab/Alert";
import "./Profile.scss";

function Profile() {
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();
  const [decks, setDecks] = useState([]);
  const [canEdit, setCanEdit] = useState(false);
  const { userId } = useParams();

  const [openRatingWindow, setOpenRatingWindow] = useState(-1);
  const [currentRating, setCurrentRating] = useState(0);
  const [deckRatings, setDeckRatings] = useState([]);
  // const [openSnackbar, setSnackbarOpen] = useState(false);
  // const [snackbarMessage, setSnackbarMessage] = useState("");
  // const [snackbarStatus, setSnackbarStatus] = useState("");

  // const Alert = (props) => (
  //   <MuiAlert elevation={6} variant="filled" {...props} />
  // );

  // const handleSnackbarOpen = (status, message) => {
  //   setSnackbarStatus(status);
  //   setSnackbarMessage(message);
  //   setSnackbarOpen(true);
  // };

  // const handleSnackbarClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setSnackbarOpen(false);
  // };

  const setRatingWindow = (index, rating) => {
    setCurrentRating(rating);
    setOpenRatingWindow(index);
  };

  const decreaseRating = () => {
    let newRating = currentRating - 1;
    if (newRating < 0) {
      newRating = 0;
    }
    setCurrentRating(newRating);
  };

  const increaseRating = () => {
    let newRating = currentRating + 1;
    if (newRating > 10) {
      newRating = 10;
    }
    setCurrentRating(newRating);
  };

  const submitRating = (deckId) => {
    setRating(user.uid, deckId, currentRating);
    setRatingWindow(-1);
  };

  useEffect(() => {
    const unsubscribe = db
      // .collection("users")
      // .doc(userId)
      .collection("decks")
      .where("user_id", "==", userId)
      .onSnapshot((snapshot) => {
        const decks = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        });
        setDecks(decks);
      });

    if (user && userId === user.uid) {
      setCanEdit(true);
    }

    return () => {
      unsubscribe();
    };
  }, [userId, user]);

  useEffect(() => {
    if (decks.length > 0) {
      const fetch = async () => {
        db.collection("ratings").onSnapshot((snapshot) => {
          if (snapshot.metadata.fromCache) {
            console.log(true);
          } else {
            console.log(false);
          }
          let ratings = [];
          snapshot.docs.map((doc, i) => {
            const data = doc.data();
            //console.log(data);
            if (ratings[data.deck_id]) {
              ratings[data.deck_id].rating =
                ratings[data.deck_id].rating + data.rating;
              ratings[data.deck_id].items++;
            } else {
              ratings[data.deck_id] = {};
              ratings[data.deck_id].rating = data.rating;
              ratings[data.deck_id].items = 1;
            }

            if (i + 1 === snapshot.docs.length) {
              let deckRatings = [];
              for (const item in ratings) {
                deckRatings[item] = Math.round(
                  ratings[item].rating / ratings[item].items
                );
              }
              setDeckRatings(deckRatings);
            }
            return true;
          });
        });
      };

      fetch();
    }
  }, [decks]);

  //console.log("DeckRatings", deckRatings);

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
                .map((deck, i) => (
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
                        <div className="profile__deck-header">
                          <div className="profile__title">
                            <h2 className="profile__name">
                              {deck.data.deck_name}
                            </h2>
                            <div className="profile__date">
                              Last updated:{" "}
                              {deck.data.timestamp.toDate().toDateString()}
                            </div>
                          </div>
                          <div className="profile__rating">
                            <div className="profile__score">
                              {deckRatings[deck.id]
                                ? deckRatings[deck.id]
                                : "-"}
                            </div>
                          </div>
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
                        {user ? (
                          <>
                            <div className="profile__add-score">
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() =>
                                  setRatingWindow(
                                    i,
                                    deckRatings[deck.id]
                                      ? deckRatings[deck.id]
                                      : 5
                                  )
                                }
                              >
                                Set Power Rating
                              </Button>
                            </div>
                            {openRatingWindow >= 0 && openRatingWindow === i ? (
                              <div className="rating">
                                <div className="rating__info">
                                  Rate this deck's power level based on the{" "}
                                  <strong>Deck Checker</strong> rating scale
                                  found{" "}
                                  <a href="#!" target="_blank">
                                    here.
                                  </a>
                                </div>
                                <div className="rating__buttons">
                                  <RemoveCircleIcon
                                    className="rating__button rating__button--subtract"
                                    onClick={decreaseRating}
                                  ></RemoveCircleIcon>
                                  <div className="rating__rating">
                                    <div className="rating__score">
                                      {currentRating}
                                    </div>
                                  </div>
                                  <AddCircleIcon
                                    className="rating__button rating__button--add"
                                    onClick={increaseRating}
                                  ></AddCircleIcon>
                                </div>
                                <div className="rating__actions">
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className="rating__submit"
                                    onClick={() => submitRating(deck.id)}
                                  >
                                    Submit
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    className="rating__submit"
                                    onClick={() => setRatingWindow(-1, 0)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          ""
                        )}
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
