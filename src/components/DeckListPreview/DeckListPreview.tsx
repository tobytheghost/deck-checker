import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

import db from "../../firebase/firebase";
import { DeckTypes } from "../../types/types";
import DeckPreviewTag from "../DeckPreviewTag/DeckPreviewTag";
import { useDeckState } from "../../context/DeckStateProvider";
import { useGlobalState } from "../../context/GlobalStateProvider";
import DeckListRatingWindow from "../DeckListRatingWindow/DeckListRatingWindow";

type DeckListPreviewTypes = {
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
  state: { deck, previewImage, isNewDeck },
  permissions: { canRate, canEdit, canDelete },
}: DeckListPreviewTypes) => {
  const [{ user }] = useGlobalState();
  const [editTitle, setEditTitle] = useState(false);
  const [deckName, setDeckName] = useState(deck.deck_name);
  const [rating, setRating]: any = useState();
  const [yourRating, setYourRating]: any = useState();
  const [{ id }] = useDeckState();
  const { tag } = deck;

  const updateDeckName = () => {
    setDeckName(deckName);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    const unsubscribeRatings = db
      .collection("ratings")
      .where("deck_id", "==", id)
      .onSnapshot((snapshot) => {
        const ratings = snapshot.docs.map((doc, i) => {
          const data = doc.data();
          if (user && data.user_id === user.uid) {
            setYourRating(data.rating);
          }
          return data.rating;
        });
        setRating(
          ratings.length
            ? ratings.reduce((total, val) => total + val) / snapshot.docs.length
            : "-"
        );
      });
    return () => {
      unsubscribeRatings();
    };
  }, [id, user]);

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
      {canEdit && <DeckPreviewTag />}
      {!isNewDeck && (
        <>
          <div className="deck__deck-header">
            <h3 className="deck__power-rating">Community Rating: </h3>
            <div className="deck__rating">
              <div className="deck__score">{rating}</div>
            </div>
          </div>
          {user && (
            <div className="deck__deck-header">
              <h3 className="deck__power-rating">Your Rating: </h3>
              <div className="deck__rating">
                <div className="deck__score">
                  {yourRating ? yourRating : "-"}
                </div>
              </div>
            </div>
          )}
          <DeckListRatingWindow />
        </>
      )}
    </div>
  );
};

export default DeckListPreview;
