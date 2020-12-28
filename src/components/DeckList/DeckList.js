import React from "react";

import { actionTypes } from "../../Reducer";
import { useStateValue } from "../../StateProvider";

// Styles
import { IconButton } from "@material-ui/core";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import "./DeckList.scss";

function DeckList(props) {
  const [{ user, deck }, dispatch] = useStateValue();

  console.log(deck);

  const removeCard = (board, sectionKey, cardKey) => {
    let newDeck = deck;
    newDeck.deck[board][sectionKey].quantity--;
    newDeck.deck[board][sectionKey].cards[cardKey].quantity--;
    if (newDeck.deck[board][sectionKey].cards[cardKey].quantity == 0) {
      delete newDeck.deck[board][sectionKey].cards[cardKey];
    }
    if (newDeck.deck[board][sectionKey].quantity == 0) {
      delete newDeck.deck[board][sectionKey];
    }
    dispatch({
      type: actionTypes.SET_DECK,
      deck: newDeck,
    });
  };

  const addCard = (board, sectionKey, cardKey) => {
    let newDeck = deck;
    newDeck.deck[board][sectionKey].quantity++;
    newDeck.deck[board][sectionKey].cards[cardKey].quantity++;
    dispatch({
      type: actionTypes.SET_DECK,
      deck: newDeck,
    });
  };

  return deck.deck && deck.deck.main ? (
    <div className="decklist">
      <div className="decklist__main">
        <div className="decklist__section decklist__section--title">
          <h2 className="decklist__title">Main Deck</h2>
        </div>
        {deck.deck.main.map((section, sectionKey) => (
          <div className="decklist__section" key={sectionKey}>
            <h3 className="decklist__subtitle">
              {section.type} ({section.quantity})
            </h3>
            <ul>
              {section.cards.map((card, cardKey) => (
                <li className="decklist__item" key={cardKey}>
                  <span className="decklist__quantity">{card.quantity}</span>{" "}
                  {card.name}{" "}
                  {props.canEdit ? (
                    <>
                      <AddCircleIcon
                        className="decklist__button decklist__button--add"
                        onClick={() => addCard("main", sectionKey, cardKey)}
                      ></AddCircleIcon>
                      <RemoveCircleIcon
                        className="decklist__button decklist__button--remove"
                        onClick={() => removeCard("main", sectionKey, cardKey)}
                      ></RemoveCircleIcon>
                    </>
                  ) : (
                    <></>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {deck.deck.side && deck.deck.side.length > 0 ? (
        <div className="decklist__side">
          <div className="decklist__section decklist__section--title">
            <h2 className="decklist__title">Sideboard</h2>
          </div>
          {deck.deck.side.map((section, sectionKey) => (
            <div className="decklist__section" key={sectionKey}>
              <h3 className="decklist__subtitle">
                {section.type} ({section.quantity})
              </h3>
              <ul>
                {section.cards.map((card, cardKey) => (
                  <li className="decklist__item" key={cardKey}>
                    <span className="decklist__quantity">{card.quantity}</span>{" "}
                    {card.name}{" "}
                    {props.canEdit ? (
                      <>
                        <AddCircleIcon
                          className="decklist__button decklist__button--add"
                          onClick={() => addCard("side", sectionKey, cardKey)}
                        ></AddCircleIcon>
                        <RemoveCircleIcon
                          className="decklist__button decklist__button--remove"
                          onClick={() =>
                            removeCard("side", sectionKey, cardKey)
                          }
                        ></RemoveCircleIcon>
                      </>
                    ) : (
                      <></>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      {deck.deck.maybe && deck.deck.maybe.length > 0 ? (
        <div className="decklist__side">
          <div className="decklist__section decklist__section--title">
            <h2 className="decklist__title">Maybeboard</h2>
          </div>
          {deck.maybe.map((section, sectionKey) => (
            <div className="decklist__section" key={sectionKey}>
              <h3 className="decklist__subtitle">
                {section.type} ({section.quantity})
              </h3>
              <ul>
                {section.cards.map((card, cardKey) => (
                  <li className="decklist__item" key={cardKey}>
                    <span className="decklist__quantity">{card.quantity}</span>{" "}
                    {card.name}{" "}
                    {props.canEdit ? (
                      <>
                        <AddCircleIcon
                          className="decklist__button decklist__button--add"
                          onClick={() => addCard("maybe", sectionKey, cardKey)}
                        ></AddCircleIcon>
                        <RemoveCircleIcon
                          className="decklist__button decklist__button--remove"
                          onClick={() =>
                            removeCard("maybe", sectionKey, cardKey)
                          }
                        ></RemoveCircleIcon>
                      </>
                    ) : (
                      <></>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <></>
  );
}

export default DeckList;
