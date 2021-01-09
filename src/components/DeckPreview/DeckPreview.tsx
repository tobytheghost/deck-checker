import React from "react";
import { Card, Chip } from "@material-ui/core";
import { Link } from "react-router-dom";

import DeckPreviewRatingWindow from "../../components/DeckPreviewRatingWindow/DeckPreviewRatingWindow";
import { DeckTypes } from "../../types/types";

type DeckPreviewTypes = {
  functions: {
    handleSubmitRating: (deckId: string, rating: number) => void;
  };
  deck: {
    id: string;
    data: DeckTypes;
  };
  rating: string | number;
};

const DeckPreview = ({
  deck,
  rating,
  functions: { handleSubmitRating },
}: DeckPreviewTypes) => {
  return (
    <div className="profile__deck-wrapper" key={deck.data.timestamp.seconds}>
      <Card variant="outlined" className="profile__card">
        <div className={"profile__deck"}>
          <div className="profile__deck-header">
            <div className="profile__title">
              <h2 className="profile__name">{deck.data.deck_name}</h2>
              <div className="profile__date">
                Last updated: {deck.data.timestamp.toDate().toDateString()}
              </div>
            </div>
            <div className="profile__rating">
              <div className="profile__score">{rating}</div>
            </div>
          </div>
          {deck.data.tag && (
            <div className="profile__tags">
              <Chip
                className={
                  "profile__chip profile__chip--" +
                  (deck.data.tag.indexOf("/") !== -1
                    ? deck.data.tag
                        .slice(0, deck.data.tag.indexOf(" "))
                        .toLowerCase()
                    : deck.data.tag.toLowerCase())
                }
                label={deck.data.tag}
              />
            </div>
          )}
          <Link to={`/d/${deck.id}`}>
            <div className="profile__image">
              <img
                width="488"
                key={deck.data.timestamp.seconds}
                className="profile__commander"
                src={deck.data.commander_image || "/card_back.jpg"}
                alt={deck.data.commander_name || deck.data.deck_name}
              />
            </div>
          </Link>
          <DeckPreviewRatingWindow
            deckId={deck.id}
            handleSubmitRating={handleSubmitRating}
          />
        </div>
      </Card>
    </div>
  );
};

export default DeckPreview;
