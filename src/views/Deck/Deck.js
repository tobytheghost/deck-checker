import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { QR, DeckList } from "../../components";
import { Error } from "../../views";
import { useStateValue } from "../../StateProvider";
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
  const [{ user }, dispatch] = useStateValue();
  const [deck, setDeck] = useState({});
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const { deckId } = useParams();
  const [value, setValue] = useState(0);
  const [reloadingImage, setReloadingImage] = useState(false);
  const [reloadingList, setReloadingList] = useState(false);
  const [editTitle, setEditTitle] = useState(false);

  const exampleDeck = {
    main: [
      {
        type: "Creatures",
        quantity: 16,
        cards: [
          {
            name: "Scourge of the Skyclaves",
            quantity: 4,
          },
          {
            name: "Deaths Shadow",
            quantity: 4,
          },
          {
            name: "Monastery Swiftspear",
            quantity: 4,
          },
          {
            name: "Tarmogoyf",
            quantity: 4,
          },
        ],
      },
      {
        type: "Instants",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Sorceries",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Enchantments",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Artifacts",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Lands",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
    ],
    side: [
      {
        type: "Creatures",
        quantity: 1,
        cards: [
          {
            name: "Lurrus of the Dream-Den",
            quantity: 1,
          },
        ],
      },
      {
        type: "Lands",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
    ],
    maybe: [
      {
        type: "Creatures",
        quantity: 1,
        cards: [
          {
            name: "Lurrus of the Dream-Den",
            quantity: 1,
          },
        ],
      },
    ],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("decks")
      .doc(deckId)
      .onSnapshot((snapshot) => {
        console.log(snapshot.data());
        setDeck(snapshot.data());
        if (snapshot.data() && user.uid === snapshot.data().user_id) {
          setCanEdit(true);
        }
        setLoading(false);
      });

    return () => {
      unsubscribe();
      alert("Save!");
    };
  }, [user, deckId]);

  // Card DB
  const [cardList, setCardList] = useState({ data: [] });
  const [searching, setSearching] = useState(false);
  const [addCard, setAddCard] = useState("");

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
    setDeck(newDeck, deck);
    setTimeout(() => {
      setReloadingImage(false);
    }, 0);
  };

  const addCardToDeck = (item, limit = false) => {
    setReloadingList(true);
    console.log(item);
    let newDeck = deck;
    const cardType = checkCardType(item);
    console.log(newDeck.deck.main);
    const { checkExistingType, typeKey } = newDeck.deck.main.filter(
      (obj, typeKey) => {
        return obj.type === cardType, typeKey;
      }
    );

    if (checkExistingType) {
      const { checkExisting, itemKey } = newDeck.deck.main.typeKey.cards.filter(
        (obj, itemKey) => {
          return obj.name === item.name, itemKey;
        }
      );

      if (checkExisting) {
        newDeck.deck.main.typeKey.cards.itemKey.quantity++;
      } else {
        newDeck.deck.main.typeKey.cards.push({
          name: item.name,
          quantity: 1,
        });
      }
      newDeck.deck.main.typeKey.quantity++;
    } else {
      newDeck.deck.main.push({
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

    setDeck(newDeck);
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
        //setDeckName(value);
        break;
      case "addCard":
        setAddCard(value);
        break;
      default:
        break;
    }
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
                                  Add to Main Deck
                                </Button>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    addCommander(item);
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
                                value={deck.deck_name}
                                onChange={handleFormOnChange}
                              />
                            ) : (
                              <a>
                                <h2 className="deck__name">
                                  {deck.deck_name}
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
                              </a>
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
                            <DeckList deck={deck.deck} key={deck.deck} />
                          </div>
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
                <div className="section__card">
                  <QR imageName={deckId} qrTitle="Deck QR Code"></QR>
                </div>
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
