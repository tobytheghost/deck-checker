import React from "react";

// Styles
import "./DeckList.scss";

function DeckList(props) {
  return (
    <div className="decklist">
      <div className="decklist__main">
        <div className="decklist__section decklist__section--title">
          <h2 className="decklist__title">Main Deck</h2>
        </div>
        {props.deck.main.map((section, sectionKey) => (
          <div className="decklist__section" key={sectionKey}>
            <h3 className="decklist__subtitle">
              {section.type} ({section.quantity})
            </h3>
            <ul>
              {section.cards.map((card, cardKey) => (
                <li className="decklist__item" key={cardKey}>
                  {card.quantity} {card.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="decklist__side">
        {props.deck.side.length > 0 ? (
          <>
            <div className="decklist__section decklist__section--title">
              <h2 className="decklist__title">Sideboard</h2>
            </div>
            {props.deck.side.map((section, sectionKey) => (
              <div className="decklist__section" key={sectionKey}>
                <h3 className="decklist__subtitle">
                  {section.type} ({section.quantity})
                </h3>
                <ul>
                  {section.cards.map((card, cardKey) => (
                    <li className="decklist__item" key={cardKey}>
                      {card.quantity} {card.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default DeckList;
