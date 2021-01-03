import React, { useState, useContext, useEffect } from "react";
import firebase from "firebase";

import { DeckContext } from "../../Deck";
import { addCardToDeck } from "../../../../helpers";

import { TextField, Button } from "@material-ui/core";

function Search(props) {
  const {
    providerDeck: { deck, setDeck },
    providerList: { list, setList },
    providerCanEdit: { canEdit },
    providerIsNewDeck: { isNewDeck },
    providerLoading: { setLoading },
    providerLoadingMessage: { setLoadingMessage },
  } = useContext(DeckContext);

  const [cardList, setCardList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addCard, setAddCard] = useState("");
  const [importCards, setImportCards] = useState();
  // eslint-disable-next-line
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
      case "importCards":
        setImportCards(value);
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

  const addNewCommander = (item, quantity = 1, board = "main", limit = 1) => {
    let updatedDeck;
    if (item.layout === "transform") {
      updatedDeck = {
        commander_type: "transform",
        deck_name: deck.deck_name,
        commander_name: item.name,
        commander_id: item.id,
        commander_image: item.card_faces[0].image_uris.normal,
        commander_image_2: item.card_faces[1].image_uris.normal,
        user_id: deck.user_id,
        list: JSON.stringify(list),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
    } else {
      updatedDeck = {
        commander_type: "normal",
        deck_name: deck.deck_name,
        commander_name: item.name,
        commander_id: item.id,
        commander_image: item.image_uris.normal,
        user_id: deck.user_id,
        list: JSON.stringify(list),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
    }
    setDeck(updatedDeck);
  };

  const addNewCard = (item, quantity = 1, board = "main", limit = null) => {
    const updatedList = addCardToDeck(list, item, quantity, board, limit);
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

  const importCard = (cardName, quantity, board = "main") => {
    const url = "https://api.scryfall.com/cards/named?fuzzy=";
    fetch(url + cardName)
      .then((response) => {
        if (!response.ok) {
          throw new Error("404");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        addNewCard(data, quantity, board);
      })
      .catch((error) => {});
  };

  const throttledProcess = (items, numberOfCards, interval) => {
    if (items.length === 0) {
      setLoadingMessage("");
      setLoading(false);
      return;
    }
    setLoadingMessage(
      "Importing card list ... " +
        (items.length - numberOfCards) * -1 +
        " of " +
        numberOfCards
    );

    importCard(items[0].name, items[0].quantity, items[0].board);

    setTimeout(
      () => throttledProcess(items.slice(1), numberOfCards, interval), // wrap in an arrow function to defer evaluation
      interval
    );
  };

  const runImport = () => {
    setLoadingMessage("Importing card list ... ");
    setLoading(true);
    let board = "main";
    let importList = [];
    importCards
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => {
        const lineItem = line.trim();
        console.log(lineItem);
        if (lineItem === "" || lineItem.toLowerCase() === "sideboard") {
          board = "side";
          return true;
        }
        const lineItemSplit = lineItem.match(/^(\S+)\s(.*)/);
        if (!lineItemSplit) {
          return true;
        }
        const lineItemArray = lineItemSplit.slice(1);
        if (lineItemArray.length !== 2) {
          return true;
        }
        const quantity = parseInt(lineItemArray[0]);
        if (isNaN(quantity)) {
          return true;
        }
        const name = lineItemArray[1];
        importList.push({ quantity: quantity, name: name, board: board });
        return true;
      });
    // console.log(importList);

    const numberOfCards = importList.length;

    if (!numberOfCards) {
      return;
    }

    setLoadingMessage("Importing card list ... 0 of " + numberOfCards);

    throttledProcess(importList, numberOfCards, 200);
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
      {canEdit || isNewDeck ? (
        <>
          <div className="section__card section__card--search">
            {/* <Card className="deck__card"> */}
            <section className="deck__actions deck__actions--top">
              <div className="deck__action deck__action--info">
                <h3 className="deck__action-title">
                  Add card(s) using search:
                </h3>
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
                                addNewCard(item, 1, "side");
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
                              Set Deck Image
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
            {/* </Card> */}
          </div>
          <div className="section__card section__card--import">
            {/* <Card className="deck__card"> */}
            <section className="deck__actions deck__actions--top">
              <div className="deck__action deck__action--info">
                <h3 className="deck__action-title">Add card(s) from list:</h3>
              </div>
              <div className="deck__action deck__action--search">
                <TextField
                  label="Import cards from list"
                  variant="outlined"
                  name="importCards"
                  multiline
                  value={importCards}
                  onChange={handleFormOnChange}
                />
              </div>
              <div className="deck__import">
                <Button variant="contained" color="primary" onClick={runImport}>
                  Import
                </Button>
              </div>
            </section>
            {/* </Card> */}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Search;
