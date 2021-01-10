import React, { useState } from "react";
import firebase from "firebase";
import { useHistory } from "react-router-dom";

import DeckList from "../../components/DeckList/DeckList";
import DeckListPreview from "../../components/DeckListPreview/DeckListPreview";
import { useDeckState } from "../../context/DeckStateProvider";
import DeckListActions from "../../components/DeckListActions/DeckListActions";
import { CardItemTypes } from "../../types/types";
import { deckActionTypes } from "../../context/DeckReducer";
import db from "../../firebase/firebase";
import PopupBar from "../../components/PopupBar/PopupBar";
import DeckListSearchContainer from "../DeckListSearchContainer/DeckListSearchContainer";
import DeckListImportContainer from "../DeckListImportContainer/DeckListImportContainer";
import { useGlobalState } from "../../context/GlobalStateProvider";

const DeckListContainer = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [{ deck, id, permissions, isNewDeck }, deckDispatch] = useDeckState();
  const [{ user }] = useGlobalState();
  const { list } = deck;
  const { canEdit } = permissions;
  const history = useHistory();

  const handleAddCard = (card: CardItemTypes) => {
    const newList = list.map((item: CardItemTypes) => {
      if (
        item.name === card.name &&
        item.board === card.board &&
        item.type === card.type
      ) {
        item.quantity = item.quantity + 1;
        return item;
      }
      return item;
    });
    const exists = newList.find(
      (item: CardItemTypes) =>
        item.name === card.name &&
        item.board === card.board &&
        item.type === card.type
    );
    if (!exists) {
      newList.push(card);
    }
    deckDispatch({
      type: deckActionTypes.SET_LIST,
      payload: {
        list: newList,
      },
    });
  };

  const handleRemoveCard = (card: CardItemTypes) => {
    const newList = list
      .map((item: CardItemTypes) => {
        if (
          item.name === card.name &&
          item.board === card.board &&
          item.type === card.type
        ) {
          item.quantity = item.quantity - 1;
          return item;
        }
        return item;
      })
      .filter((item: CardItemTypes) => {
        //console.log(item);
        return item.quantity > 0;
      });
    deckDispatch({
      type: deckActionTypes.SET_LIST,
      payload: {
        list: newList,
      },
    });
  };

  const handleSaveDeck = async () => {
    if (!id) {
      handleSaveNewDeck();
      return;
    }
    const docRef = db.collection("decks").doc(id);
    const doc = await docRef.get();
    if (doc.exists) {
      try {
        await docRef.update({
          deck_name: deck.deck_name,
          commander_name: deck.commander_name,
          commander_image: deck.commander_image,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          list: JSON.stringify(deck.list),
          tag: deck.tag,
        });

        setPopupMessage("Deck Saved.");
        setPopupStatus("success");
        setPopupOpen(true);
      } catch (error) {
        console.error(`Unable to save deck: ${error}`);

        setPopupMessage("Unable to save deck.");
        setPopupStatus("error");
        setPopupOpen(true);
      }
    } else {
      setPopupMessage("Unable to save deck.");
      setPopupStatus("error");
      setPopupOpen(true);
    }
  };

  const handleSaveNewDeck = async () => {
    console.log(deck, deck.list.length, user);
    if (!deck || !deck.list.length || !user) {
      setPopupMessage("Unable to save new deck.");
      setPopupStatus("error");
      setPopupOpen(true);
      return;
    }
    console.log(user);
    const newList = JSON.stringify(deck.list);
    const newDeck = { ...deck, list: newList, user_id: user.uid };
    console.log(newDeck);
    try {
      await db
        .collection("decks")
        .add(newDeck)
        .then((deck) => {
          history.push("/d/" + deck.id);
        });

      setPopupMessage("New Deck Saved.");
      setPopupStatus("success");
      setPopupOpen(true);
    } catch (error) {
      console.error(`Unable to save new deck: ${error}`);

      setPopupMessage("Unable to save new deck.");
      setPopupStatus("error");
      setPopupOpen(true);
    }
  };

  const handleDeleteDeck = () => {
    db.collection("decks")
      .doc(id)
      .delete()
      .then(function () {
        history.push("/u/" + user.uid);
      })
      .catch(function (error) {
        console.error("Error removing deck: ", error);
      });

    setPopupMessage("Deck deleted.");
    setPopupStatus("success");
    setPopupOpen(true);
  };

  const handleChangePreviewImage = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupStatus, setPopupStatus] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  return (
    <>
      <DeckListPreview
        state={{ deck, previewImage, isNewDeck }}
        permissions={permissions}
      />
      <DeckList
        functions={{
          handleChangePreviewImage,
          handleAddCard,
          handleRemoveCard,
        }}
        state={{ list }}
        permissions={permissions}
      />
      {(canEdit || isNewDeck) && (
        <DeckListActions
          functions={{ handleSaveDeck, handleDeleteDeck }}
          state={{ isNewDeck }}
        />
      )}
      {user && (
        <>
          <DeckListSearchContainer functions={{ handleAddCard }} />
          <DeckListImportContainer />
        </>
      )}
      <PopupBar
        open={popupOpen}
        message={popupMessage}
        status={popupStatus}
        handlePopupClose={handlePopupClose}
      />
    </>
  );
};

export default DeckListContainer;
