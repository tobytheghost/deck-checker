import React, { useState } from "react";
import { Button } from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";

type DeckListRatingWindowTypes = {
  handleSubmitRating: (deckId: string, rating: number) => void;
  deckId: string;
};

const DeckListRatingWindow = ({
  deckId,
  handleSubmitRating,
}: DeckListRatingWindowTypes) => {
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
      <div className="deck-rating">
        <div className="deck-rating__info">
          Rate this deck's power level based on the{" "}
          <strong>Deck Checker</strong> rating scale found{" "}
          <a href="#!" target="_blank">
            here.
          </a>
        </div>
        {!openRatingWindow ? (
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
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default DeckListRatingWindow;
