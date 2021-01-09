import React from "react";
import { Card } from "@material-ui/core";

import { DeckTypes } from "../../types/types";
import QR from "../../components/QR/QR";
import DeckTabsContainer from "../../containers/DeckTabsContainer/DeckTabsContainer";

type DeckPropTypes = {
  functions: {};
  state: {
    deckId: string;
    deck: DeckTypes;
    permissions: {
      canEdit: boolean;
    };
  };
};

const Deck = ({
  functions: {},
  state: { deckId, deck, permissions: canEdit },
}: DeckPropTypes) => {
  return (
    <>
      <section className="section section--deck">
        <div className="section__card section__card--full">
          <Card>
            <div className="deck">
              <DeckTabsContainer />
            </div>
          </Card>
        </div>
      </section>
      {canEdit && (
        <section className="section">
          <div className="section__card">
            <QR imageName={deckId} qrTitle="Deck QR Code"></QR>
          </div>
        </section>
      )}
    </>
  );
};

export default Deck;
