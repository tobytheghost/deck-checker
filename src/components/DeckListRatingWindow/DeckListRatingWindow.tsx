import React, { useState } from "react";
import { Button } from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import { useGlobalState } from "../../context/GlobalStateProvider";
import { useDeckState } from "../../context/DeckStateProvider";
import db from "../../firebase/firebase";

const DeckListRatingWindow = () => {
  const [openRatingWindow, setOpenRatingWindow] = useState(false);
  const [currentRating, setCurrentRating] = useState(5);
  const [{ user }] = useGlobalState();
  const [{ id, deck }] = useDeckState();

  const handleSubmitRating = async (id: string, value: number) => {
    const rating = {
      user_id: deck.user_id,
      deck_id: id,
      rating: value,
      owner_id: user.uid,
    };
    const docRef = db.collection("ratings").doc(id + "_" + user.uid);
    const doc = await docRef.get();
    if (doc.exists) {
      docRef.update(rating);
    } else {
      docRef.set(rating);
    }
  };

  const increaseRating = () => {
    if (currentRating < 10) {
      const newRating = currentRating + 1;
      setCurrentRating(newRating);
    }
  };

  const decreaseRating = () => {
    if (currentRating > 0) {
      const newRating = currentRating - 1;
      setCurrentRating(newRating);
    }
  };

  const submitRating = () => {
    setOpenRatingWindow(false);
    handleSubmitRating(id, currentRating);
  };

  if (openRatingWindow) {
    return (
      <div className="deck-rating">
        <div className="deck-rating__buttons">
          <RemoveCircleIcon
            className="deck-rating__button deck-rating__button--subtract"
            onClick={decreaseRating}
          ></RemoveCircleIcon>
          <div className="deck-rating__rating">
            <div className="deck-rating__score">{currentRating}</div>
          </div>
          <AddCircleIcon
            className="deck-rating__button deck-rating__button--add"
            onClick={increaseRating}
          ></AddCircleIcon>
        </div>
        <div className="deck-rating__actions">
          <Button
            variant="contained"
            color="primary"
            className="deck-rating__submit"
            onClick={submitRating}
          >
            Submit
          </Button>
          <Button
            variant="outlined"
            className="deck-rating__submit"
            onClick={() => setOpenRatingWindow(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="deck-rating">
      <div className="deck-rating__info">
        Rate this deck's power level based on the <strong>Deck Checker</strong>{" "}
        rating scale found{" "}
        <a href="#!" target="_blank">
          here.
        </a>
      </div>
      <div className="deck-rating__add-score">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            setOpenRatingWindow(true);
          }}
        >
          Set Power Rating
        </Button>
      </div>
    </div>
  );
};

export default DeckListRatingWindow;
