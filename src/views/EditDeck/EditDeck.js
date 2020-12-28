import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { DeckList } from "../../components";
import { checkCardType } from "../../helpers";

// Styles
import { Button, Card, TextField } from "@material-ui/core";
import "./EditDeck.scss";
import { actionTypes } from "../../Reducer";

function EditDeck() {
  // eslint-disable-next-line
  const [{ user, deck }, dispatch] = useStateValue();
  const history = useHistory();

  // eslint-disable-next-line
  const [reloadingImage, setReloadingImage] = useState(false);
  // eslint-disable-next-line
  const [reloadingList, setReloadingList] = useState(false);

  // Form Variables
  const [deckName, setDeckName] = useState("");

  useEffect(() => {
    dispatch({
      type: actionTypes.SET_DECK,
      deck: {
        deck: {
          main: [],
          side: [],
          maybe: [],
        },
      },
    });
  }, [dispatch]);

  const saveDeck = (e) => {
    e.preventDefault();
    console.log("You saved a deck", deckName ? deckName : deck.commander_name);

    const data = {
      deck_name: deckName ? deckName : deck.commander_name,
      commander_name: deck.commander_name,
      commander_id: deck.commander_id,
      commander_image: deck.commander_image,
      user_id: user.uid,
      deck: JSON.stringify(deck.deck),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("decks")
      .add(data)
      .then((deck) => {
        //console.log(deck);
        assignDeckToUser(deck, data);
      });
  };

  const assignDeckToUser = (deck, data) => {
    //console.log(deck, data);
    db.collection("users")
      .doc(user.uid)
      .collection("decks")
      .doc(deck.id)
      .set({
        deck_name: deckName ? deckName : data.commander_name,
        commander_name: data.commander_name,
        commander_id: data.commander_id,
        commander_image: data.commander_image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        history.push("/d/" + deck.id);
      });
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

  // Card DB
  const [cardList, setCardList] = useState({ data: [] });
  const [searching, setSearching] = useState(false);
  const [addCard, setAddCard] = useState("");

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

  //Deck Manipulation

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
    //console.log(deck);
    setTimeout(() => {
      setReloadingList(false);
    }, 0);
  };

  return (
    <div className="edit-deck">
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
          <div className="edit-deck__search-list">Searching ...</div>
        ) : addCard.length > 2 && cardList.data.length > 0 ? (
          <ul className="edit-deck__search-list">
            {cardList.data
              .filter((item, i) => {
                if (!addCard) return true;
                if (item.name.toLowerCase().includes(addCard.toLowerCase())) {
                  return true;
                }
                return false;
              })
              .slice(0, 100)
              .map((item, i) => (
                <li className="edit-deck__search-item" key={i}>
                  <span>
                    {item.name}
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        addCardToDeck(item);
                      }}
                    >
                      Add to Deck
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
          <div className="edit-deck__search-list"></div>
        ) : (
          <></>
        )}
      </Card>
      <Card>
        <div className="edit-deck__form">
          <form>
            <div className="edit-deck__input">
              <TextField
                label="Deck Name"
                variant="outlined"
                name="deckName"
                type="text"
                value={deckName}
                onChange={handleFormOnChange}
              />
            </div>
            <div className="edit-deck__list">
              {deck && deck.deck_name !== "" ? (
                <div className="edit-deck__preview">
                  <h2 className="edit-deck__name">{deck.commander_name}</h2>
                  <div className="edit-deck__image">
                    <img
                      className="edit-deck__commander"
                      src={deck.commander_image}
                      alt={deck.commander_name}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              {deck ? (
                <div className="edit-deck__decklist">
                  <DeckList key={deck.deck} canEdit={true} />
                </div>
              ) : (
                <></>
              )}
            </div>
            <Button
              type="submit"
              onClick={saveDeck}
              variant="contained"
              color="primary"
            >
              Save Deck
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default EditDeck;
