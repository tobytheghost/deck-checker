import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase";

import { DeckContext } from "../../Deck";
import { addCardToDeck } from "../../../../helpers";

import { Card, TextField, Button } from "@material-ui/core";

function Search(props) {
  const {
    providerDeck: { deck, setDeck },
    providerList: { list, setList },
    providerCanEdit: { canEdit },
  } = useContext(DeckContext);

  const [cardList, setCardList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addCard, setAddCard] = useState("");
  const [deckName, setDeckName] = useState("");

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

  const searchUrl = "https://api.scryfall.com/cards/search?q=";
  const searchCards = (search) => {
    fetch(searchUrl + search)
      .then((response) => {
        if (!response.ok) {
          throw new Error("404");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setCardList(data.data);
        setSearching(false);
      })
      .catch((error) => {
        setSearching(false);
      });
  };

  const addNewCommander = (item, board = "main", limit = 1) => {
    const updatedList = addCardToDeck(list, item, board, limit);
    setList(updatedList);
    const updatedDeck = {
      deck_name: deck.deck_name,
      commander_name: item.name,
      commander_id: item.id,
      commander_image: item.image_uris.normal,
      user_id: deck.user_id,
      list: JSON.stringify(updatedList),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);
  };

  const addNewCard = (item, board = "main", limit = null) => {
    const updatedList = addCardToDeck(list, item, board, limit);
    setList(updatedList);
    const updatedDeck = {
      deck_name: deck.deck_name,
      commander_name: deck.commander_name,
      commander_id: deck.commander_id,
      commander_image: deck.commander_image,
      user_id: deck.user_id,
      list: JSON.stringify(updatedList),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);
  };

  const clearSearch = () => {
    setAddCard("");
    setCardList([]);
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

  return (
    <>
      {canEdit ? (
        <div className="section__card">
          <Card className="deck__card">
            <section className="deck__actions deck__actions--top">
              <div className="deck__action deck__action--info">
                <h3 className="deck__action-title">Add Card(s) to deck:</h3>
              </div>
              <div className="deck__action deck__action--search">
                <TextField
                  label="Search"
                  variant="outlined"
                  name="addCard"
                  type="text"
                  placeholder="Search Cards ..."
                  value={addCard}
                  onChange={handleFormOnChange}
                />
                <div className="deck__clear-button">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={clearSearch}
                  >
                    Clear Search
                  </Button>
                </div>
              </div>
              {searching ? (
                <div className="deck__search-list">Searching ...</div>
              ) : addCard.length > 2 && cardList.length > 0 ? (
                <ul className="deck__search-list">
                  {cardList
                    .filter((item, i) => {
                      if (!addCard) return true;
                      if (
                        item.name.toLowerCase().includes(addCard.toLowerCase())
                      ) {
                        return true;
                      }
                      return false;
                    })
                    .slice(0, 100)
                    .map((item, i) => (
                      <li className="deck__search-item" key={i}>
                        <span>
                          <div className="deck__search-name">{item.name}</div>
                          <div className="deck__search-buttons">
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                addNewCard(item);
                              }}
                            >
                              Add to Main
                            </Button>
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                addNewCard(item, "side");
                              }}
                            >
                              Add to Side
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                addNewCommander(item);
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
    </>
  );
}

export default Search;
