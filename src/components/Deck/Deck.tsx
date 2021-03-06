import React from "react";
import { Card } from "@material-ui/core";

import { DeckTypes } from "../../types/types";
import QR from "../../components/QR/QR";
import DeckTabsContainer from "../../containers/DeckTabsContainer/DeckTabsContainer";
import { useDeckState } from "../../context/DeckStateProvider";

import "./Deck.scss";
import { useGlobalState } from "../../context/GlobalStateProvider";

type DeckPropTypes = {
  state: {
    deck: DeckTypes;
    permissions: {
      canEdit: boolean;
    };
    isNewDeck: boolean;
  };
};

const Deck = ({
  state: { deck, permissions: canEdit, isNewDeck },
}: DeckPropTypes) => {
  const [{ id }] = useDeckState();
  const [{ user }] = useGlobalState();
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
      {canEdit && !isNewDeck && user && user.uid === deck.user_id && (
        <section className="section">
          <div className="section__card">
            <QR imageName={id} qrTitle="Deck QR Code"></QR>
          </div>
        </section>
      )}
    </>
  );
};

export default Deck;
