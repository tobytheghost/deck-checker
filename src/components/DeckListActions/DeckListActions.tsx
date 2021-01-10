import React from "react";
import { Button } from "@material-ui/core";

type DeckListActionsTypes = {
  functions: {
    handleSaveDeck: () => void;
    handleDeleteDeck: () => void;
  };
  state: {
    isNewDeck: boolean;
  };
};

const DeckListActions = ({
  functions: { handleSaveDeck, handleDeleteDeck },
  state: { isNewDeck },
}: DeckListActionsTypes) => {
  return (
    <div className="deck__actions deck__actions--bottom">
      <div className="deck__action">
        <Button
          type="submit"
          onClick={handleSaveDeck}
          variant="contained"
          color="primary"
        >
          {isNewDeck ? "Save New Deck" : "Save Changes"}
        </Button>
      </div>
      {/* {!isNewDeck && (
        <div className="deck__action deck__action--delete">
          <Button
            type="submit"
            onClick={handleDeleteDeck}
            variant="contained"
            color="primary"
          >
            Delete Deck
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default DeckListActions;
