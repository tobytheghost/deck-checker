import React, { useState } from "react";
import { Button } from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";

type DeckPreviewRatingWindowTypes = {
  handleSubmitRating: (deckId: string, rating: number) => void;
  deckId: string;
};

const DeckPreviewRatingWindow = ({
  deckId,
  handleSubmitRating,
}: DeckPreviewRatingWindowTypes) => {
  const [openRatingWindow, setOpenRatingWindow] = useState(false);
  const [currentRating, setCurrentRating] = useState(5);

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
    console.log(deckId, currentRating);
    setOpenRatingWindow(false);
    handleSubmitRating(deckId, currentRating);
  };

  return (
    <>
      <div className="profile__add-score">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenRatingWindow(true)}
        >
          Set Power Rating
        </Button>
      </div>
      {openRatingWindow && (
        <div className="rating">
          <div className="rating__info">
            Rate this deck's power level based on the{" "}
            <strong>Deck Checker</strong> rating scale found{" "}
            <a href="#!" target="_blank">
              here.
            </a>
          </div>
          <div className="rating__buttons">
            <RemoveCircleIcon
              className="rating__button rating__button--subtract"
              onClick={decreaseRating}
            ></RemoveCircleIcon>
            <div className="rating__rating">
              <div className="rating__score">{currentRating}</div>
            </div>
            <AddCircleIcon
              className="rating__button rating__button--add"
              onClick={increaseRating}
            ></AddCircleIcon>
          </div>
          <div className="rating__actions">
            <Button
              variant="contained"
              color="primary"
              className="rating__submit"
              onClick={submitRating}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              className="rating__submit"
              onClick={() => setOpenRatingWindow(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeckPreviewRatingWindow;
