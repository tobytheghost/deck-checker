import React, { useState, useEffect } from "react";

import DeckListSearch from "../../components/DeckListSearch/DeckListSearch";
import { CardItemTypes } from "../../types/types";
import { checkCardType, formatCard } from "../../helpers/decklist";
import { deckActionTypes } from "../../context/DeckReducer";
import { useDeckState } from "../../context/DeckStateProvider";

type DeckListSearchContainerTypes = {
  functions: {
    handleAddCard: (card: CardItemTypes) => void;
  };
};
const DeckListSearchContainer = ({
  functions: { handleAddCard },
}: DeckListSearchContainerTypes) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cardList, setCardList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [{}, deckDispatch] = useDeckState();

  const handleSearchOnChange = (e: any) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const addCardFromSearch = (
    card: any,
    board: string,
    cardType: string | null
  ) => {
    const type = cardType || checkCardType(card);

    const formattedCard = formatCard(card, board, 1, type);

    //console.log(formattedCard);

    handleAddCard(formattedCard);
  };

  const searchUrl = "https://api.scryfall.com/cards/search?q=";
  const searchCards = (search: string) => {
    fetch(searchUrl + search)
      .then((response) => {
        if (!response.ok) {
          throw new Error("404");
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setCardList(data.data);
        setSearching(false);
      })
      .catch((error) => {
        console.error(error);
        setSearching(false);
      });
  };

  const handleSetDeckImage = (item: CardItemTypes) => {
    const card = formatCard(item);

    deckDispatch({
      type: deckActionTypes.SET_DECK_IMAGE,
      payload: {
        commander_name: card.name,
        commander_image: card.image,
      },
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.length > 2) {
        setSearching(true);
        searchCards(searchQuery);
      } else {
        setCardList([]);
      }
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <DeckListSearch
      functions={{
        handleSearchOnChange,
        handleClearSearch,
        addCardFromSearch,
        handleSetDeckImage,
      }}
      state={{ searchQuery, cardList }}
      loading={{ searching }}
    />
  );
};

export default DeckListSearchContainer;
