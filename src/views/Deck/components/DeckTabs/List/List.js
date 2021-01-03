import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import firebase from "firebase";

import db from "../../../../../firebase";
import { DeckContext } from "../../../Deck";
import { useStateValue } from "../../../../../StateProvider";
import { parseTextForSymbols, setRating } from "../../../../../helpers";
import Search from "../../Search/Search";

import {
  TextField,
  Button,
  makeStyles,
  Modal,
  Snackbar,
  InputLabel,
  MenuItem,
  FormControl,
  Chip,
} from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MuiAlert from "@material-ui/lab/Alert";
import Select from "@material-ui/core/Select";
import { Mana } from "@saeris/react-mana";
import "./List.scss";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function List() {
  const [{ user }] = useStateValue();

  const {
    providerDeck: { deck, setDeck },
    providerList: { list, setList },
    providerCanEdit: { canEdit },
    providerLoading: { loading },
    providerIsNewDeck: { isNewDeck },
    //providerUpdateLog: { updateLog, setUpdateLog },
    //providerLog: { log, setLog },
  } = useContext(DeckContext);

  const history = useHistory();
  const { deckId } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [deckName, setDeckName] = useState(
    deck.deck_name ? deck.deck_name : ""
  );
  const [editTitle, setEditTitle] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [ratingWindowOpen, setRatingWindowOpen] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [deckRating, setDeckRating] = useState(0);
  const [yourRating, setYourRating] = useState(0);
  const [tag, setTag] = useState(deck.tag ? deck.tag : "");

  //console.log(tag, tag.length);

  const classes = useStyles();

  useEffect(() => {
    if (isNewDeck) {
      setEditTitle(true);
    }
  }, [isNewDeck]);

  const handleDeckNameChange = (e) => {
    setDeckName(e.target.value);
  };

  const addCard = (item, board, sectionKey, cardKey) => {
    let updatedList = list;
    updatedList[board + "_quantity"]++;
    updatedList[board][sectionKey].quantity++;
    updatedList[board][sectionKey].cards[cardKey].quantity++;
    updatedList[board][sectionKey].cards
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      .sort((a, b) => {
        if (a.cmc < b.cmc) {
          return -1;
        }
        if (a.cmc > b.cmc) {
          return 1;
        }
        return 0;
      });
    setList(updatedList);
    const updatedDeck = {
      deck_name: deck.deck_name,
      commander_name: deck.commander_name,
      commander_id: deck.commander_id,
      commander_image: deck.commander_image,
      user_id: deck.user_id,
      list: JSON.stringify(updatedList),
      tag: deck.tag,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);

    // let newLog = updateLog;
    // let checkExisting = false;

    // for (let i = 0; i < newLog.length; i++) {
    //   if (newLog[i].name === item.name) {
    //     checkExisting = true;
    //     newLog[i].quantity++;
    //   }
    // }

    // if (!checkExisting) {
    //   newLog.push({
    //     name: item.name,
    //     quantity: 1,
    //   });
    // }

    // setUpdateLog(newLog);

    // console.log(updateLog);
  };

  const removeCard = (item, board, sectionKey, cardKey) => {
    let updatedList = list;
    updatedList[board + "_quantity"]--;
    if (updatedList[board + "_quantity"] < 0) {
      updatedList[board + "_quantity"] = 0;
    }
    updatedList[board][sectionKey].quantity--;
    if (updatedList[board][sectionKey].quantity < 0) {
      updatedList[board][sectionKey].quantity = 0;
    }
    updatedList[board][sectionKey].cards[cardKey].quantity--;
    if (updatedList[board][sectionKey].cards[cardKey].quantity < 0) {
      updatedList[board][sectionKey].cards[cardKey].quantity = 0;
    }
    if (updatedList[board][sectionKey].cards[cardKey].quantity === 0) {
      updatedList[board][sectionKey].cards.splice(cardKey, 1);
    }
    if (updatedList[board][sectionKey].quantity === 0) {
      updatedList[board].splice(sectionKey, 1);
    }
    setList(updatedList);
    const updatedDeck = {
      deck_name: deck.deck_name,
      commander_name: deck.commander_name,
      commander_id: deck.commander_id,
      commander_image: deck.commander_image,
      user_id: deck.user_id,
      list: JSON.stringify(updatedList),
      tag: deck.tag,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);

    // let newLog = updateLog;
    // let checkExisting = false;

    // for (let i = 0; i < newLog.length; i++) {
    //   if (newLog[i].name === item.name) {
    //     checkExisting = true;
    //     newLog[i].quantity--;
    //   }
    // }

    // if (!checkExisting) {
    //   newLog.push({
    //     name: item.name,
    //     quantity: -1,
    //   });
    // }

    // setUpdateLog(newLog);

    // console.log(updateLog);
  };

  const getSectionTitle = (key) => {
    switch (key) {
      case "main":
        return "Main Deck";
      case "side":
        return "Sideboard";
      default:
        return key;
    }
  };

  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");

  const Alert = (props) => (
    <MuiAlert elevation={6} variant="filled" {...props} />
  );

  const handleSnackbarOpen = (status, message) => {
    setSnackbarStatus(status);
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const deleteDeckCheck = () => {
    setModalOpen(true);
  };

  const deleteDeck = () => {
    db.collection("decks")
      .doc(deckId)
      .delete()
      .then(function () {
        //console.log("Deck successfully deleted!");
        history.push("/u/" + user.uid);
      })
      .catch(function (error) {
        console.error("Error removing deck: ", error);
      });
    // db.collection("users")
    //   .doc(user.uid)
    //   .collection("decks")
    //   .doc(deckId)
    //   .delete()
    //   .then(function () {
    //     //console.log("User deck successfully deleted!");
    //     history.push("/u/" + user.uid);
    //   })
    //   .catch(function (error) {
    //     console.error("Error removing user deck: ", error);
    //   });
    handleSnackbarOpen("success", "Deck deleted!");
  };

  const saveDeck = () => {
    setEditTitle(false);
    const updatedDeck = {
      deck_name: deckName ? deckName : deck.deck_name,
      commander_name: deck.commander_name,
      commander_id: deck.commander_id,
      commander_image: deck.commander_image,
      user_id: deck.user_id,
      list: deck.list,
      tag: tag ? tag : deck.tag,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);

    // db.collection("users")
    //   .doc(user.uid)
    //   .collection("decks")
    //   .doc(deckId)
    //   .update({
    //     deck_name: deckName ? deckName : deck.deck_name,
    //     commander_name: deck.commander_name,
    //     commander_id: deck.commander_id,
    //     commander_image: deck.commander_image,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   });

    db.collection("decks")
      .doc(deckId)
      .update({
        deck_name: deckName ? deckName : deck.deck_name,
        commander_name: deck.commander_name,
        commander_id: deck.commander_id,
        commander_image: deck.commander_image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        list: deck.list,
        tag: tag ? tag : deck.tag,
      });
    // console.log(updateLog);
    // const updateLogDB = async () => {
    //   const docRef = db.collection("deckLogs").doc(deckId);
    //   const doc = await docRef.get();
    //   if (doc.exists) {
    //     docRef.onSnapshot((snapshot) => {
    //       const deckLog = snapshot.data();
    //       if (deckLog) {
    //         setLog(deckLog);
    //       }
    //       console.log(deckLog);
    //     });
    //     if (updateLog.length) {
    //       console.log(log.log);
    //       let addLog = JSON.parse(log.log);
    //       addLog.push({
    //         timestamp: new Date(),
    //         log: JSON.stringify(updateLog),
    //       });
    //       db.collection("deckLogs")
    //         .doc(deckId)
    //         .update({
    //           log: JSON.stringify(addLog),
    //         });
    //     }
    //   } else {
    //     db.collection("deckLogs").doc(deckId).set({
    //       timestamp: new Date(),
    //       log: [],
    //     });
    //   }
    //   setUpdateLog([]);
    //   setLog({});
    // };
    // updateLogDB();
    handleSnackbarOpen("success", "Deck saved!");
  };

  const saveNewDeck = () => {
    // if (!deck.commander_name || !deck.commander_id) {
    //   handleSnackbarOpen("error", "No deck image set.");
    //   return;
    // }

    if (deckName === "" && deck.commander_name === "") {
      setDeckName("New Deck");
    }

    //console.log(tag);

    const data = {
      deck_name: deckName ? deckName : deck.commander_name,
      commander_name: deck.commander_name,
      commander_id: deck.commander_id,
      commander_image: deck.commander_image,
      user_id: user.uid,
      list: deck.list,
      tag: tag,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    //console.log(data);

    db.collection("decks")
      .add(data)
      .then((deck) => {
        //assignDeckToUser(deck, data);
        //createNewLog(deck);
        history.push("/d/" + deck.id);
      });

    handleSnackbarOpen("success", "Deck added!");
  };

  // const assignDeckToUser = (deck, data) => {
  //   //console.log(deck, data);
  //   db.collection("users")
  //     .doc(user.uid)
  //     .collection("decks")
  //     .doc(deck.id)
  //     .set({
  //       deck_name: deckName ? deckName : data.commander_name,
  //       commander_name: data.commander_name,
  //       commander_id: data.commander_id,
  //       commander_image: data.commander_image,
  //       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //     })
  //     .then(() => {
  //       history.push("/d/" + deck.id);
  //     });
  // };

  // const createNewLog = (deck) => {
  //   db.collection("deckLogs").doc(deck.id).set({
  //     timestamp: new Date(),
  //     log: [],
  //   });
  // };

  const modalBody = (
    <div style={modalStyle} className={classes.paper + " modal"}>
      <h2 className="modal__title">Delete Deck</h2>
      <p className="modal__description">
        Are you sure you want to delete this deck? This action cannot be undone.
      </p>
      <div className="modal__actions">
        <div className="modal__action modal__action--delete">
          <Button onClick={deleteDeck} variant="contained" color="primary">
            Delete Deck
          </Button>
        </div>
        <div className="modal__action">
          <Button onClick={handleModalClose} variant="contained">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

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
    setRating(user.uid, deck.user_id, deckId, currentRating);
    //setCurrentRating(deckRating);
    setRatingWindowOpen(false);
    handleSnackbarOpen("success", "Rating submitted!");
  };

  useEffect(() => {
    if (deckId) {
      const fetch = async () => {
        db.collection("ratings")
          .where("deck_id", "==", deckId)
          .onSnapshot((snapshot) => {
            if (snapshot.metadata.fromCache) {
              //console.log(true);
            } else {
              //console.log(false);
            }
            let rating = 0;
            let items = 0;
            snapshot.docs.map((doc, i) => {
              const data = doc.data();
              //console.log(data);
              rating = rating + data.rating;
              items++;

              if (user && data.user_id === user.uid) {
                setYourRating(data.rating);
              }

              if (i + 1 === snapshot.docs.length) {
                let deckRating = Math.round(rating / items);
                setDeckRating(deckRating);
                setCurrentRating(deckRating);
              }
              return true;
            });
          });
      };

      fetch();
    }
  }, [deckId, user]);

  const handleSelectChange = (e) => {
    setTag(e.target.value);
  };

  const menuItems = [
    {
      label: "Brawl",
      value: "brawl",
    },
    {
      label: "EDH / Commander",
      value: "edh",
    },
    {
      label: "Historic",
      value: "historic",
    },
    {
      label: "Legacy",
      value: "legacy",
    },
    {
      label: "Modern",
      value: "modern",
    },
    {
      label: "Pauper",
      value: "pauper",
    },
    {
      label: "Pioneer",
      value: "pioneer",
    },
    {
      label: "Standard",
      value: "standard",
    },
    {
      label: "Vintage",
      value: "vintage",
    },
  ];

  return (
    <>
      <div className="deck__preview">
        {editTitle ? (
          <TextField
            label="Deck Name"
            variant="outlined"
            name="deckName"
            type="text"
            value={deckName}
            onChange={handleDeckNameChange}
          />
        ) : (
          <h2 className="deck__name">
            {deck.deck_name ? deck.deck_name : "New Deck"}
            {canEdit ? (
              <Button
                size="small"
                onClick={() => {
                  setEditTitle(true);
                }}
              >
                Edit
              </Button>
            ) : (
              <></>
            )}
          </h2>
        )}
        {tag ? (
          <div className="deck__tags">
            <Chip
              className={
                "deck__chip deck__chip--" +
                (tag.indexOf("/") !== -1
                  ? tag.slice(0, tag.indexOf(" ")).toLowerCase()
                  : tag.toLowerCase())
              }
              label={tag}
            />
          </div>
        ) : (
          ""
        )}
        <div className="deck__image">
          <img
            className="decks__commander"
            src={
              previewImage
                ? previewImage
                : deck.commander_image
                ? deck.commander_image
                : "/card_back.jpg"
            }
            alt={deck.commander}
            key={deck.commander}
          />
        </div>
        {canEdit ? (
          <div className="deck__tag">
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Format
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={tag}
                onChange={handleSelectChange}
                label="Format"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {menuItems.map((item, i) => {
                  return (
                    <MenuItem key={i} value={item.label}>
                      {item.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
        ) : (
          ""
        )}
        {!isNewDeck ? (
          <>
            <div className="deck__deck-header">
              <h3 className="deck__power-rating">Community Rating: </h3>
              <div className="deck__rating">
                <div className="deck__score">
                  {deckRating ? deckRating : "-"}
                </div>
              </div>
            </div>
            {user ? (
              <div className="deck__deck-header">
                <h3 className="deck__power-rating">Your Rating: </h3>
                <div className="deck__rating">
                  <div className="deck__score">
                    {yourRating ? yourRating : "-"}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            {user ? (
              <>
                <div className="deck-rating">
                  <div className="deck-rating__info">
                    Rate this deck's power level based on the{" "}
                    <strong>Deck Checker</strong> rating scale found{" "}
                    <a href="#!" target="_blank">
                      here.
                    </a>
                  </div>
                  {!ratingWindowOpen ? (
                    <div className="deck-rating__add-score">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setRatingWindowOpen(true);
                        }}
                      >
                        Set Power Rating
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="deck-rating__buttons">
                        <RemoveCircleIcon
                          className="deck-rating__button deck-rating__button--subtract"
                          onClick={decreaseRating}
                        ></RemoveCircleIcon>
                        <div className="deck-rating__rating">
                          <div className="deck-rating__score">
                            {currentRating}
                          </div>
                        </div>
                        <AddCircleIcon
                          className="deck-rating__button deck-rating__button--add"
                          onClick={increaseRating}
                        ></AddCircleIcon>
                      </div>
                      <div className="deck-rating__actions">
                        <Button
                          variant="contained"
                          color="primary"
                          className="deck-rating__submit"
                          onClick={() => submitRating(deckId)}
                        >
                          Submit
                        </Button>
                        <Button
                          variant="outlined"
                          className="deck-rating__submit"
                          onClick={() => setRatingWindowOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          ""
        )}
      </div>
      <div className="deck__decklist">
        {!loading ? (
          <div className="decklist">
            <div className="decklist__main">
              {Object.keys(list).map((key) => (
                <React.Fragment key={key}>
                  {Array.isArray(list[key]) && list[key].length ? (
                    <div className="decklist__section decklist__section--title">
                      <h2 className="decklist__title">
                        {getSectionTitle(key)} ({list[key + "_quantity"]})
                      </h2>
                    </div>
                  ) : (
                    <></>
                  )}
                  {Array.isArray(list[key]) &&
                    list[key].map((section, sectionKey) => (
                      <div
                        className="decklist__section"
                        key={section.type + section.quantity}
                      >
                        <h3 className="decklist__subtitle">
                          {section.type} ({section.quantity})
                        </h3>
                        <ul>
                          {section.cards.map((card, cardKey) => (
                            <li
                              className="decklist__item"
                              key={cardKey}
                              onMouseEnter={() => {
                                setPreviewImage(card.image);
                              }}
                              onMouseLeave={() => {
                                setPreviewImage("");
                              }}
                            >
                              <span className="decklist__quantity">
                                {canEdit || isNewDeck ? (
                                  <AddCircleIcon
                                    className="decklist__button decklist__button--add"
                                    onClick={() =>
                                      addCard(card, key, sectionKey, cardKey)
                                    }
                                  ></AddCircleIcon>
                                ) : (
                                  <></>
                                )}
                                <span className="decklist__quantity-number">
                                  {card.quantity}
                                </span>
                                {canEdit || isNewDeck ? (
                                  <RemoveCircleIcon
                                    className="decklist__button decklist__button--remove"
                                    onClick={() =>
                                      removeCard(card, key, sectionKey, cardKey)
                                    }
                                  ></RemoveCircleIcon>
                                ) : (
                                  <></>
                                )}
                              </span>
                              <span className="decklist__card-name">
                                {card.name}
                              </span>
                              <span className="decklist__mana">
                                {card.mana_cost
                                  ? parseTextForSymbols(card.mana_cost).map(
                                      (item, i) => {
                                        if (item === "|") {
                                          return (
                                            <span className="decklist__mana-split">
                                              {"//"}
                                            </span>
                                          );
                                        } else {
                                          return (
                                            <Mana
                                              key={i}
                                              symbol={item}
                                              shadow
                                              fixed
                                              size="1x"
                                            />
                                          );
                                        }
                                      }
                                    )
                                  : ""}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {canEdit || isNewDeck ? (
        <>
          <div className="deck__actions deck__actions--bottom">
            <div className="deck__action">
              <Button
                type="submit"
                onClick={isNewDeck ? saveNewDeck : saveDeck}
                variant="contained"
                color="primary"
              >
                {isNewDeck ? "Save New Deck" : "Save Changes"}
              </Button>
            </div>
            {!isNewDeck ? (
              <div className="deck__action deck__action--delete">
                <Button
                  type="submit"
                  onClick={deleteDeckCheck}
                  variant="contained"
                  color="primary"
                >
                  Delete Deck
                </Button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {modalBody}
          </Modal>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarStatus}>
              <>{snackbarMessage}</>
            </Alert>
          </Snackbar>
        </>
      ) : (
        <></>
      )}
      <Search />
    </>
  );
}

export default List;
