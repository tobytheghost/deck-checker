import React from "react";
import { Card } from "@material-ui/core";

import { CardItemTypes } from "../../types/types";
import { cardGroups, boards } from "../../helpers/decklist";
import DeckListItem from "../../components/DeckListItem/DeckListItem";

import "./DeckList.scss";

type DeckListTypes = {
  functions: {
    handleChangePreviewImage: (imageUrl: string) => void;
    handleAddCard: (card: CardItemTypes) => void;
    handleRemoveCard: (card: CardItemTypes) => void;
  };
  state: {
    list: {
      [x: string]: any;
    };
  };
  permissions: {};
};

const DeckList = ({ functions, state, permissions }: DeckListTypes) => {
  const { list } = state;

  if (!list.length) {
    return <></>;
  }

  const deckList = boards.map((board) => {
    let boardCount = 0; // Start counting items

    const group = cardGroups.map((type) => {
      // Check items belong in type and board
      const filteredSection = list.filter(
        (card: CardItemTypes) => card.type === type && card.board === board
      );

      // Map filtered items
      const sectionItems = filteredSection.map((card: CardItemTypes) => {
        return (
          <DeckListItem key={card.name} card={card} functions={functions} />
        );
      });

      // If no items, return blank
      if (!sectionItems.length) {
        return;
      }

      // Check quantities for section
      const quantities = filteredSection.map(
        (card: CardItemTypes) => card.quantity
      );
      const total = quantities?.reduce(
        (total: number, val: number) => total + val
      );

      // Append to board total
      boardCount = boardCount + total;

      return (
        <React.Fragment key={type + total}>
          <div className="decklist__section" key={type + total}>
            <h3 className="decklist__subtitle">
              {type === "Commander" && total > 1 ? `${type}s` : type} ({total})
            </h3>
            <ul>{sectionItems}</ul>
          </div>
        </React.Fragment>
      );
    });
    if (!boardCount) {
      return;
    }

    return (
      <React.Fragment key={board}>
        <div className="decklist__section decklist__section--title">
          <h2 className="decklist__title">
            {board} ({boardCount})
          </h2>
        </div>
        {group}
      </React.Fragment>
    );
  });

  //console.log(deckList);

  return (
    <div className="deck__decklist">
      <div className="decklist">
        <Card variant="outlined">
          <div className="decklist__main">{deckList}</div>
        </Card>
      </div>
    </div>
  );
};

export default DeckList;
