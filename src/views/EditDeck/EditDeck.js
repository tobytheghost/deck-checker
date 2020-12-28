import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { DeckList } from "../../components";

// Styles
import { Button, Card, TextField } from "@material-ui/core";
import "./EditDeck.scss";

function EditDeck() {
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();

  // Form Variables
  const [deckName, setDeckName] = useState("");
  const [commander, setCommander] = useState({
    commanderName: "",
    commanderId: "",
    commanderImage: "",
  });

  const [deck, setDeck] = useState({
    main: [],
    side: [],
    maybe: [],
  });

  const saveDeck = (e) => {
    e.preventDefault();
    console.log("You saved a deck", deckName);

    const data = {
      deck_name: deckName,
      commander_name: commander.commanderName,
      commander_id: commander.commanderId,
      commander_image: commander.commanderImage,
      user_id: user.uid,
      deck: deck,
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
    console.log(data);
    db.collection("users")
      .doc(user.uid)
      .collection("decks")
      .doc(deck.id)
      .set({
        deck_name: deckName,
        commander_name: commander.commanderName,
        commander_id: commander.commanderId,
        commander_image: commander.commanderImage,
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
  const [loading, setLoading] = useState(false);
  const [addCard, setAddCard] = useState("");

  const searchUrl = "https://api.scryfall.com/cards/search?q=";
  const searchCards = (search) => {
    //console.log(`Searching for ${search}`);
    fetch(searchUrl + search)
      .then((response) => response.json())
      .then((data) => {
        setCardList(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (addCard.length > 2) {
        setLoading(true);
        searchCards(addCard);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [addCard]);

  //Deck Manipulation

  const addToDeck = (item) => {
    console.log(item);
  };

  const addCommander = (item) => {
    setCommander({
      commanderName: item.name,
      commanderId: item.id,
      commanderImage: item.image_uris.normal,
    });
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
        {loading ? (
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
                        addToDeck(item);
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
              {commander.name !== "" ? (
                <div className="edit-deck__preview">
                  <h2 className="edit-deck__name">{commander.commanderName}</h2>
                  <div className="edit-deck__image">
                    <img
                      className="edit-deck__commander"
                      src={commander.commanderImage}
                      alt={commander.commanderName}
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
              <DeckList deck={deck} />
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
