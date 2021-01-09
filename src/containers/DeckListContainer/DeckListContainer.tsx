import React, { useState } from "react";

import DeckList from "../../components/DeckList/DeckList";
import DeckListPreview from "../../components/DeckListPreview/DeckListPreview";
import { useDeckState } from "../../context/DeckStateProvider";
import DeckListActions from "../../components/DeckListActions/DeckListActions";
import { CardItemTypes } from "../../types/types";
import { deckActionTypes } from "../../context/DeckReducer";

const DeckListContainer = () => {
  const [previewImage, setPreviewImage] = useState("");
  const [{ deck, permissions }, deckDispatch] = useDeckState();
  const isNewDeck = false;
  const { list } = deck;
  const { canEdit } = permissions;

  const handleAddCard = (card: CardItemTypes) => {
    const newList = list.map((item: CardItemTypes) => {
      if (item.name === card.name) {
        item.quantity = item.quantity + 1;
        return item;
      }
      return item;
    });
    const exists = newList.find(
      (item: CardItemTypes) => item.name === card.name
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
        if (item.name === card.name) {
          item.quantity = item.quantity - 1;
          return item;
        }
        return item;
      })
      .filter((item: CardItemTypes) => {
        console.log(item);
        return item.quantity > 0;
      });
    deckDispatch({
      type: deckActionTypes.SET_LIST,
      payload: {
        list: newList,
      },
    });
  };

  const handleDeckNameChange = () => {};

  const handleSaveDeck = () => {};

  const handleDeleteDeck = () => {};

  const handleChangePreviewImage = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  return (
    <>
      <DeckListPreview
        state={{ deck, previewImage, isNewDeck }}
        permissions={permissions}
        functions={{ handleDeckNameChange }}
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
        <>
          <DeckListActions
            functions={{ handleSaveDeck, handleDeleteDeck }}
            state={{ isNewDeck }}
          />
          {/* <Modal
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
          </Snackbar> */}
        </>
      )}
      {/* <Search /> */}
    </>
  );
};

export default DeckListContainer;
