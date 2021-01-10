import React, { useState } from "react";
import { CircularProgress } from "@material-ui/core";

import DeckListImport from "../../components/DeckListImport/DeckListImport";
import { checkCardType, formatCard } from "../../helpers/decklist";
import { CardItemTypes } from "../../types/types";
import { useDeckState } from "../../context/DeckStateProvider";
import { deckActionTypes } from "../../context/DeckReducer";

const DeckListImportContainer = () => {
  const [importCards, setImportCards] = useState("");
  const [importing, setImporting] = useState(false);
  const [importingMessage, setImportingMessage] = useState("");

  const [{ deck }, deckDispatch] = useDeckState();
  const { list } = deck;

  const handleImportOnChange = (e: any) => {
    setImportCards(e.target.value);
  };

  const apiCallTimeout = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const runImport = async () => {
    setImportingMessage("Importing card list ... ");
    setImporting(true);
    let board = "Main Deck";
    const importList: any = [];
    importCards
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => {
        const lineItem = line.trim();
        //console.log(lineItem);
        if (lineItem === "" || lineItem.toLowerCase() === "sideboard") {
          board = "Sideboard";
          return true;
        }
        const lineItemSplit = lineItem.match(/^(\S+)\s(.*)/);
        if (!lineItemSplit) {
          return true;
        }
        const lineItemArray = lineItemSplit.slice(1);
        if (lineItemArray.length !== 2) {
          return true;
        }
        const quantity = parseInt(lineItemArray[0]);
        if (isNaN(quantity)) {
          return true;
        }
        const name = lineItemArray[1];
        const item = { name: name, quantity: quantity, board: board };
        importList.push(item);
        return true;
      });
    console.log(importList);

    const numberOfCards = importList.length;
    if (!numberOfCards) {
      return;
    }

    setImportingMessage("Importing card list ... 0 of " + numberOfCards);

    let completedImports = 0;
    const cardsToImport = await Promise.all(
      importList.map(async (item: any, index: number) => {
        await apiCallTimeout(index * 200);

        const card = await importCard(item.name);

        completedImports = completedImports + 1;
        setImportingMessage(
          `Importing card list ... ${completedImports} of ${numberOfCards}`
        );
        const formattedCard = addCardFromImport(
          card,
          item.board,
          item.quantity
        );
        return formattedCard;
      })
    );

    handleAddImportedCards(cardsToImport);
    setImporting(false);
  };

  const importCard = async (cardName: string) => {
    const url = "https://api.scryfall.com/cards/named?fuzzy=";

    try {
      const response = await fetch(url + cardName);
      if (!response.ok) {
        throw new Error("404");
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return;
    }
  };

  const addCardFromImport = (card: any, board: string, quantity: number) => {
    const type = checkCardType(card);
    const formattedCard = formatCard(card, board, quantity, type);

    return formattedCard;
  };

  const handleAddImportedCards = (cards: any) => {
    const importList = list.map((item: CardItemTypes) => {
      const card = cards.find(
        (card: CardItemTypes) =>
          item.name === card.name && item.board === card.board
      );
      if (!card) {
        return item;
      }
      card.quantity = card.quantity + item.quantity;
      return card;
    });
    cards.map((card: CardItemTypes) => {
      const exists = importList.find(
        (item: CardItemTypes) => item.name === card.name
      );
      if (!exists) {
        importList.push(card);
      }
      return card;
    });
    console.log(importList);
    deckDispatch({
      type: deckActionTypes.SET_LIST,
      payload: {
        list: importList,
      },
    });
    setImportCards("");
  };

  if (importing) {
    return (
      <div className="section__loading">
        <div className="section__loading-message">{importingMessage}</div>
        <CircularProgress />
      </div>
    );
  }

  return (
    <DeckListImport
      functions={{ handleImportOnChange, runImport }}
      state={{ importCards }}
    />
  );
};

export default DeckListImportContainer;
