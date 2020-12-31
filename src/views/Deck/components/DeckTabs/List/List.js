import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import firebase from "firebase";

import db from "../../../../../firebase";
import { DeckContext } from "../../../Deck";
import { useStateValue } from "../../../../../StateProvider";

import {
  TextField,
  Button,
  makeStyles,
  Modal,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import { EditIcon } from "@material-ui/icons/Edit";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MuiAlert from "@material-ui/lab/Alert";
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
  } = useContext(DeckContext);

  const history = useHistory();
  const { deckId } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [deckName, setDeckName] = useState(deck.deck_name);
  const [editTitle, setEditTitle] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (isNewDeck) {
      setEditTitle(true);
    }
  }, [isNewDeck]);

  const handleDeckNameChange = (e) => {
    setDeckName(e.target.value);
  };

  const addCard = (board, sectionKey, cardKey) => {
    let updatedList = list;
    updatedList[board][sectionKey].quantity++;
    updatedList[board][sectionKey].cards[cardKey].quantity++;
    updatedList[board][sectionKey].cards.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
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
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);
  };

  const removeCard = (board, sectionKey, cardKey) => {
    let updatedList = list;
    updatedList[board][sectionKey].quantity--;
    updatedList[board][sectionKey].cards[cardKey].quantity--;
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
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);
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
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    setDeck(updatedDeck);

    db.collection("users")
      .doc(user.uid)
      .collection("decks")
      .doc(deckId)
      .update({
        deck_name: deckName ? deckName : deck.deck_name,
        commander_name: deck.commander_name,
        commander_id: deck.commander_id,
        commander_image: deck.commander_image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    db.collection("decks")
      .doc(deckId)
      .update({
        deck_name: deckName ? deckName : deck.deck_name,
        commander_name: deck.commander_name,
        commander_id: deck.commander_id,
        commander_image: deck.commander_image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        list: deck.list,
      });
    handleSnackbarOpen("success", "Deck saved!");
  };

  const saveNewDeck = (e) => {
    e.preventDefault();

    if (!deck.commander_name || !deck.commander_id) {
      handleSnackbarOpen("error", "No deck image set.");
      return;
    }

    const data = {
      deck_name: deckName ? deckName : deck.commander_name,
      commander_name: deck.commander_name,
      commander_id: deck.commander_id,
      commander_image: deck.commander_image,
      user_id: user.uid,
      list: deck.list,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("decks")
      .add(data)
      .then((deck) => {
        assignDeckToUser(deck, data);
      });

    handleSnackbarOpen("success", "Deck added!");
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
        <div className="deck__image">
          <img
            className="decks__commander"
            src={deck.commander_image ? deck.commander_image : "/card_back.jpg"}
            alt={deck.commander}
            key={deck.commander}
          />
        </div>
      </div>
      <div className="deck__decklist">
        {!loading ? (
          <div className="decklist">
            <div className="decklist__main">
              {Object.keys(list).map((key) => (
                <React.Fragment key={key}>
                  {list[key].length ? (
                    <div className="decklist__section decklist__section--title">
                      <h2 className="decklist__title">
                        {getSectionTitle(key)}
                      </h2>
                    </div>
                  ) : (
                    <></>
                  )}
                  {list[key].map((section, sectionKey) => (
                    <div
                      className="decklist__section"
                      key={section.type + section.quantity}
                    >
                      <h3 className="decklist__subtitle">
                        {section.type} ({section.quantity})
                      </h3>
                      <ul>
                        {section.cards.map((card, cardKey) => (
                          <li className="decklist__item" key={cardKey}>
                            <span className="decklist__quantity">
                              {card.quantity}
                            </span>{" "}
                            {card.name}{" "}
                            {canEdit ? (
                              <>
                                <AddCircleIcon
                                  className="decklist__button decklist__button--add"
                                  onClick={() =>
                                    addCard(key, sectionKey, cardKey)
                                  }
                                ></AddCircleIcon>
                                <RemoveCircleIcon
                                  className="decklist__button decklist__button--remove"
                                  onClick={() =>
                                    removeCard(key, sectionKey, cardKey)
                                  }
                                ></RemoveCircleIcon>
                              </>
                            ) : (
                              <></>
                            )}
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
    </>
  );
}

export default List;
