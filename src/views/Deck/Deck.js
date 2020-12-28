import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { QR, DeckList } from "../../components";
import { Error } from "../../views";
import { useStateValue } from "../../StateProvider";
import { actionTypes } from "../../Reducer";
import { checkCardType } from "../../helpers";

// Styles
import {
  Card,
  Tab,
  Tabs,
  AppBar,
  CircularProgress,
  Button,
  TextField,
} from "@material-ui/core";
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

function Deck() {
  // eslint-disable-next-line
  const [{ user, deck }, dispatch] = useStateValue();
  //const [deck, setDeck] = useState({});
  const [loading, setLoading] = useState(true);
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
        console.log(snapshot.data());
        dispatch({
          type: actionTypes.SET_DECK,
          deck: snapshot.data(),
        });
        setDeckName(snapshot.data().deck_name);
        if (user && snapshot.data() && user.uid === snapshot.data().user_id) {
          setCanEdit(true);
        }
        setLoading(false);
      });

    return () => {
      unsubscribe();
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
      .then((response) => response.json())
      .then((data) => {
        setCardList(data);
        setSearching(false);
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

  const addCommander = (item) => {
    setReloadingImage(true);
    let newDeck = deck;
    newDeck.commander_name = item.name;
    newDeck.commander_id = item.id;
    newDeck.commander_image = item.image_uris.normal;
    console.log(newDeck);
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
        console.log(newDeck.deck[board][typeKey].cards[i].name);
        if (newDeck.deck[board][typeKey].cards[i].name === item.name) {
          checkExisting = true;
          itemKey = i;
          console.log(
            newDeck.deck[board][typeKey].cards,
            checkExisting,
            itemKey
          );
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
      if (!limit || limit > newDeck.deck[board][typeKey].quantity) {
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
    console.log(deck);
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
    newDeck.deck_name = deckName;
    setEditTitle(false);
    setAddCard("");
    dispatch({
      type: actionTypes.SET_DECK,
      deck: newDeck,
    });
    console.log(deck);

    db.collection("decks").doc(deckId).set(deck);
  };

  return (
    <>
      {!loading ? (
        <>
          {deck ? (
            <>
              {canEdit ? (
                <section className="deck__actions">
                  <Card>
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
                                {item.name}{" "}
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
                                    addCardToDeck(item);
                                  }}
                                >
                                  Add to Side
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    addCommander(item, "side");
                                  }}
                                >
                                  Set Commander
                                </Button>
                              </span>
                            </li>
                          ))}
                      </ul>
                    ) : cardList.length ? (
                      <div className="search__list"></div>
                    ) : (
                      <></>
                    )}
                  </Card>
                </section>
              ) : (
                <></>
              )}
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
                              <Button
                                type="submit"
                                onClick={saveDeck}
                                variant="contained"
                                color="primary"
                              >
                                Save Changes
                              </Button>
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
    </>
  );
}

export default Deck;
