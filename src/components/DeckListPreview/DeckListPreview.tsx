import React, { useState } from "react";
import {
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

import { DeckTypes } from "../../types/types";

type DeckListPreviewTypes = {
  functions: {
    handleDeckNameChange: (deckName: string) => void;
  };
  state: {
    deck: DeckTypes;
    previewImage: string;
    isNewDeck: boolean;
  };
  permissions: {
    canRate: boolean;
    canEdit: boolean;
    canDelete: boolean;
  };
};

const DeckListPreview = ({
  functions: { handleDeckNameChange },
  state: { deck, previewImage, isNewDeck },
  permissions: { canRate, canEdit, canDelete },
}: DeckListPreviewTypes) => {
  const [editTitle, setEditTitle] = useState(false);
  const [deckName, setDeckName] = useState(deck.deck_name);
  const { tag } = deck;

  const updateDeckName = () => {
    setDeckName(deckName);
  };

  return (
    <div className="deck__preview">
      {editTitle ? (
        <TextField
          label="Deck Name"
          variant="outlined"
          name="deckName"
          type="text"
          value={deckName}
          onChange={updateDeckName}
        />
      ) : (
        <h2 className="deck__name">
          {deck.deck_name ? deck.deck_name : "New Deck"}
          {canEdit && (
            <Button
              size="small"
              onClick={() => {
                setEditTitle(true);
              }}
            >
              Edit
            </Button>
          )}
        </h2>
      )}
      {tag && (
        <div className="deck__tags">
          <Chip
            className={
              "deck__chip deck__chip--" +
              (tag.indexOf("/") !== -1
                ? tag.slice(0, tag.indexOf(" ")).toLowerCase()
                : tag.toLowerCase())
            }
            label={tag}
          />
        </div>
      )}
      <div className="deck__image">
        <img
          className="decks__commander"
          src={
            previewImage
              ? previewImage
              : deck.commander_image
              ? deck.commander_image
              : "/card_back.jpg"
          }
          alt={deck.commander_name}
          key={deck.commander_name}
        />
      </div>
      {/* {canEdit && (
        <DeckPreviewTag/>
      )}
      {!isNewDeck && (
        <>
          <div className="deck__deck-header">
            <h3 className="deck__power-rating">Community Rating: </h3>
            <div className="deck__rating">
              <div className="deck__score">{deckRating ? deckRating : "-"}</div>
            </div>
          </div>
          {canRate && (
            <div className="deck__deck-header">
              <h3 className="deck__power-rating">Your Rating: </h3>
              <div className="deck__rating">
                <div className="deck__score">
                  {yourRating ? yourRating : "-"}
                </div>
              </div>
            </div>
          )}
          <RatingWindow/>
        </>
      )} */}
    </div>
  );
};

export default DeckListPreview;
