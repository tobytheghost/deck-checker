import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { useParams, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { QR, DeckList } from "../../components";
import { Error } from "../../views";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";
import { checkCardType } from "../../helpers";
import firebase from "firebase";

// Styles
import {
  Card,
  Tab,
  Tabs,
  AppBar,
  CircularProgress,
  Button,
  TextField,
  Modal,
  makeStyles,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import EditIcon from "@material-ui/icons/Edit";
import "./Deck.scss";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

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

function Deck() {
  // eslint-disable-next-line
  const [{ user, deck }, dispatch] = useStateValue();
  const history = useHistory();
  const [loader, setLoader] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const { deckId } = useParams();
  const [value, setValue] = useState(0);
  const [editTitle, setEditTitle] = useState(false);

  // eslint-disable-next-line
  const [reloadingImage, setReloadingImage] = useState(false);
  // eslint-disable-next-line
  const [reloadingList, setReloadingList] = useState(false);

  // const exampleDeck = {
  //   main: [
  //     {
  //       type: "Creatures",
  //       quantity: 16,
  //       cards: [
  //         {
  //           name: "Scourge of the Skyclaves",
  //           quantity: 4,
  //         },
  //         {
  //           name: "Deaths Shadow",
  //           quantity: 4,
  //         },
  //         {
  //           name: "Monastery Swiftspear",
  //           quantity: 4,
  //         },
  //         {
  //           name: "Tarmogoyf",
  //           quantity: 4,
  //         },
  //       ],
  //     },
  //     {
  //       type: "Instants",
  //       quantity: 4,
  //       cards: [
  //         {
  //           name: "Lightning Bolt",
  //           quantity: 4,
  //         },
  //       ],
  //     },
  //     {
  //       type: "Sorceries",
  //       quantity: 4,
  //       cards: [
  //         {
  //           name: "Lightning Bolt",
  //           quantity: 4,
  //         },
  //       ],
  //     },
  //     {
  //       type: "Enchantments",
  //       quantity: 4,
  //       cards: [
  //         {
  //           name: "Lightning Bolt",
  //           quantity: 4,
  //         },
  //       ],
  //     },
  //     {
  //       type: "Artifacts",
  //       quantity: 4,
  //       cards: [
  //         {
  //           name: "Lightning Bolt",
  //           quantity: 4,
  //         },
  //       ],
  //     },
  //     {
  //       type: "Lands",
  //       quantity: 4,
  //       cards: [
  //         {
  //           name: "Lightning Bolt",
  //           quantity: 4,
  //         },
  //       ],
  //     },
  //   ],
  //   side: [
  //     {
  //       type: "Creatures",
  //       quantity: 1,
  //       cards: [
  //         {
  //           name: "Lurrus of the Dream-Den",
  //           quantity: 1,
  //         },
  //       ],
  //     },
  //     {
  //       type: "Lands",
  //       quantity: 4,
  //       cards: [
  //         {
  //           name: "Lightning Bolt",
  //           quantity: 4,
  //         },
  //       ],
  //     },
  //   ],
  //   maybe: [
  //     {
  //       type: "Creatures",
  //       quantity: 1,
  //       cards: [
  //         {
  //           name: "Lurrus of the Dream-Den",
  //           quantity: 1,
  //         },
  //       ],
  //     },
  //   ],
  // };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("decks")
      .doc(deckId)
      .onSnapshot((snapshot) => {
        //console.log(snapshot.data());
        if (snapshot.data()) {
          let deck = snapshot.data();
          const list = snapshot.data().deck;
          deck.deck = JSON.parse(list);
          dispatch({
            type: actionTypes.SET_DECK,
            deck: deck,
          });
          //console.log(deck);
          setDeckName(snapshot.data().deck_name);
        }
        if (user && snapshot.data() && user.uid === snapshot.data().user_id) {
          setCanEdit(true);
        }
        setLoader(false);
      });

    return () => {
      unsubscribe();
      dispatch({
        type: actionTypes.SET_DECK,
        deck: null,
      });
    };
  }, [user, deckId, dispatch]);

  // Card DB
  const [cardList, setCardList] = useState({ data: [] });
  const [searching, setSearching] = useState(false);
  const [addCard, setAddCard] = useState("");
  const [deckName, setDeckName] = useState("");

  const searchUrl = "https://api.scryfall.com/cards/search?q=";
  const searchCards = (search) => {
    //console.log(`Searching for ${search}`);
    fetch(searchUrl + search)
      .then((response) => {
        if (!response.ok) {
          throw new Error("404");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        //console.log(data);
        setCardList(data);
        setSearching(false);
      })
      .catch((error) => {
        setSearching(false);
        //console.error(error);
      });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (addCard.length > 2) {
        setSearching(true);
        searchCards(addCard);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [addCard]);

  //Snackbar
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const [openSnackbar, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");

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

  const addCommander = (item) => {
    setReloadingImage(true);
    let newDeck = deck;
    newDeck.commander_name = item.name;
    newDeck.commander_id = item.id;
    newDeck.commander_image = item.image_uris.normal;
    //console.log(newDeck);
    dispatch({
      type: actionTypes.SET_DECK,
      deck: newDeck,
    });
    addCardToDeck(item, "main", 1);
    setTimeout(() => {
      setReloadingImage(false);
    }, 0);
  };

  const addCardToDeck = (item, board = "main", limit = null) => {
    setReloadingList(true);
    let newDeck = deck;
    const cardType = checkCardType(item);
    let checkExistingType = false;
    let typeKey = null;

    for (let i = 0; i < newDeck.deck[board].length; i++) {
      if (newDeck.deck[board][i].type === cardType) {
        checkExistingType = true;
        typeKey = i;
        break;
      }
    }

    if (checkExistingType && typeKey != null) {
      let checkExisting = false;
      let itemKey = null;

      for (let i = 0; i < newDeck.deck[board][typeKey].cards.length; i++) {
        //console.log(newDeck.deck[board][typeKey].cards[i].name);
        if (newDeck.deck[board][typeKey].cards[i].name === item.name) {
          checkExisting = true;
          itemKey = i;
          // console.log(
          //   newDeck.deck[board][typeKey].cards,
          //   checkExisting,
          //   itemKey
          // );
          break;
        }
      }

      if (checkExisting && itemKey != null) {
        if (
          !limit ||
          limit > newDeck.deck[board][typeKey].cards[itemKey].quantity
        ) {
          newDeck.deck[board][typeKey].cards[itemKey].quantity++;
        }
      } else {
        newDeck.deck[board][typeKey].cards.push({
          name: item.name,
          quantity: 1,
        });
      }
      if (
        !limit ||
        (limit > newDeck.deck[board][typeKey].quantity && checkExisting)
      ) {
        newDeck.deck[board][typeKey].quantity++;
      }
    } else {
      newDeck.deck[board].push({
        type: cardType,
        quantity: 1,
        cards: [
          {
            name: item.name,
            quantity: 1,
          },
        ],
      });
    }

    dispatch({
      type: actionTypes.SET_DECK,
      deck: newDeck,
    });
    //console.log(deck);
    setTimeout(() => {
      setReloadingList(false);
    }, 0);
  };

  const handleFormOnChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    switch (name) {
      case "deckName":
        setDeckName(value);
        break;
      case "addCard":
        setAddCard(value);
        break;
      default:
        break;
    }
  };

  const saveDeck = () => {
    let newDeck = deck;
    if (deckName) {
      newDeck.deck_name = deckName;
    }
    setEditTitle(false);
    setAddCard("");
    dispatch({
      type: actionTypes.SET_DECK,
      deck: newDeck,
    });
    //console.log(deck);

    //console.log(deckId);

    db.collection("users")
      .doc(user.uid)
      .collection("decks")
      .doc(deckId)
      .update({
        deck_name: deck.deck_name,
        commander_name: deck.commander_name,
        commander_id: deck.commander_id,
        commander_image: deck.commander_image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

    db.collection("decks")
      .doc(deckId)
      .update({
        deck_name: deck.deck_name,
        commander_name: deck.commander_name,
        commander_id: deck.commander_id,
        commander_image: deck.commander_image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        deck: JSON.stringify(deck.deck),
      });

    handleSnackbarOpen("success", "Deck saved!");
  };

  const deleteDeck = () => {
    dispatch({
      type: actionTypes.SET_DECK,
      deck: null,
    });

    db.collection("decks")
      .doc(deckId)
      .delete()
      .then(function () {
        //console.log("Deck successfully deleted!");
        history.push("/");
      })
      .catch(function (error) {
        console.error("Error removing deck: ", error);
      });
    db.collection("users")
      .doc(user.uid)
      .collection("decks")
      .doc(deckId)
      .delete()
      .then(function () {
        //console.log("User deck successfully deleted!");
        history.push("/u/" + user.uid);
      })
      .catch(function (error) {
        console.error("Error removing user deck: ", error);
      });
  };

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const classes = useStyles();

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const deleteDeckCheck = () => {
    setModalOpen(true);
  };

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

  return (
    <>
      {!loader ? (
        <>
          {deck ? (
            <>
              <section className="section section--deck">
                <div className="section__card section__card--full">
                  <Card>
                    <div className="deck">
                      <AppBar position="static">
                        <Tabs value={value} onChange={handleChange}>
                          <Tab label="Decklist" {...a11yProps(0)} />
                          <Tab
                            label="Deck Updates"
                            disabled
                            {...a11yProps(1)}
                          />
                          <Tab label="Stats" disabled {...a11yProps(2)} />
                        </Tabs>
                      </AppBar>
                      <TabPanel value={value} index={0}>
                        <div className="deck__section deck__section--decklist">
                          <div className="deck__preview">
                            {canEdit && editTitle ? (
                              <TextField
                                className="deck__name-input"
                                variant="outlined"
                                name="deckName"
                                type="text"
                                value={deckName}
                                onChange={handleFormOnChange}
                              />
                            ) : (
                              <h2 className="deck__name">
                                {deckName}
                                {canEdit ? (
                                  <button
                                    className="deck__name-edit"
                                    onClick={() => {
                                      setEditTitle(true);
                                    }}
                                  >
                                    <EditIcon />
                                  </button>
                                ) : (
                                  <></>
                                )}
                              </h2>
                            )}
                            <div className="deck__image">
                              <img
                                className="decks__commander"
                                src={deck.commander_image}
                                alt={deck.commander}
                                key={deck.commander}
                              />
                            </div>
                          </div>
                          <div className="deck__decklist">
                            <DeckList
                              key={deck.deck}
                              canEdit={canEdit}
                              //onChangeDeckList={handleDeckChange(deck)}
                            />
                          </div>
                          {canEdit ? (
                            <div className="deck__actions deck__actions--bottom">
                              <div className="deck__action">
                                <Button
                                  type="submit"
                                  onClick={saveDeck}
                                  variant="contained"
                                  color="primary"
                                >
                                  Save Changes
                                </Button>
                              </div>
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
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <div className="deck__section">Here</div>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <div className="deck__section">Here</div>
                      </TabPanel>
                    </div>
                  </Card>
                </div>
                {canEdit ? (
                  <div className="section__card">
                    <Card className="deck__card">
                      <section className="deck__actions deck__actions--top">
                        <TextField
                          label="Search"
                          variant="outlined"
                          name="addCard"
                          type="text"
                          placeholder="Search Cards ..."
                          value={addCard}
                          onChange={handleFormOnChange}
                        />
                        {searching ? (
                          <div className="deck__search-list">Searching ...</div>
                        ) : addCard.length > 2 && cardList.data.length > 0 ? (
                          <ul className="deck__search-list">
                            {cardList.data
                              .filter((item, i) => {
                                if (!addCard) return true;
                                if (
                                  item.name
                                    .toLowerCase()
                                    .includes(addCard.toLowerCase())
                                ) {
                                  return true;
                                }
                                return false;
                              })
                              .slice(0, 100)
                              .map((item, i) => (
                                <li className="deck__search-item" key={i}>
                                  <span>
                                    <div className="deck__search-name">
                                      {item.name}
                                    </div>
                                    <div className="deck__search-buttons">
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                          addCardToDeck(item);
                                        }}
                                      >
                                        Add to Main
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                          addCardToDeck(item, "side");
                                        }}
                                      >
                                        Add to Side
                                      </Button>
                                      <Button
                                        variant="outlined"
                                        onClick={() => {
                                          addCommander(item);
                                        }}
                                      >
                                        Set Commander
                                      </Button>
                                    </div>
                                  </span>
                                </li>
                              ))}
                          </ul>
                        ) : cardList.length ? (
                          <div className="search__list"></div>
                        ) : (
                          <></>
                        )}
                      </section>
                    </Card>
                  </div>
                ) : (
                  <></>
                )}
              </section>
              <section className="section">
                {canEdit ? (
                  <div className="section__card">
                    <QR imageName={deckId} qrTitle="Deck QR Code"></QR>
                  </div>
                ) : (
                  <></>
                )}
              </section>
            </>
          ) : (
            <Error></Error>
          )}
        </>
      ) : (
        <div className="section__loading">
          <CircularProgress />
        </div>
      )}
      {canEdit ? (
        <>
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
    </>
  );
}

export default Deck;
