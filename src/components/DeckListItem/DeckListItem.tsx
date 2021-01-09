import React from "react";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
// @ts-ignore
import { Mana } from "@saeris/react-mana";

import { useDeckState } from "../../context/DeckStateProvider";
import { CardItemTypes } from "../../types/types";
import { parseTextForSymbols } from "../../helpers/decklist";

type DeckListItemTypes = {
  card: CardItemTypes;
  functions: {
    handleChangePreviewImage: (image: string) => void;
    handleAddCard: (card: CardItemTypes) => void;
    handleRemoveCard: (card: CardItemTypes) => void;
  };
};

const isNewDeck = false;

const DeckListItem = ({
  card,
  functions: { handleChangePreviewImage, handleAddCard, handleRemoveCard },
}: DeckListItemTypes) => {
  const [
    {
      permissions: { canEdit },
    },
  ] = useDeckState();

  return (
    <li
      className="decklist__item"
      key={card.name + card.quantity}
      onMouseEnter={() => {
        handleChangePreviewImage(card.image);
      }}
      onMouseLeave={() => {
        handleChangePreviewImage("");
      }}
    >
      <span className="decklist__quantity">
        {(canEdit || isNewDeck) && (
          <RemoveCircleIcon
            className="decklist__button decklist__button--remove"
            onClick={() => handleRemoveCard(card)}
          ></RemoveCircleIcon>
        )}
        <span className="decklist__quantity-number">{card.quantity} </span>
        {(canEdit || isNewDeck) && (
          <AddCircleIcon
            className="decklist__button decklist__button--add"
            onClick={() => handleAddCard(card)}
          ></AddCircleIcon>
        )}
      </span>
      <span className="decklist__card-name">{card.name}</span>
      <span className="decklist__mana">
        {card.mana_cost
          ? parseTextForSymbols(card.mana_cost).map((item, i) => {
              if (item === "|") {
                return <span className="decklist__mana-split">{"//"}</span>;
              } else {
                return <Mana key={i} symbol={item} shadow fixed size="1x" />;
              }
            })
          : ""}
      </span>
    </li>
  );
};

export default DeckListItem;
