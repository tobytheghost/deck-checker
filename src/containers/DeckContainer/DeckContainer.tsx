import React, { useEffect } from "react";
// import firebase from "firebase";
import { useParams } from "react-router-dom";

// App
import db from "../../firebase/firebase";
import { DeckStateProvider } from "../../context/DeckStateProvider";
import { useDeckState } from "../../context/DeckStateProvider";
import deckReducer from "../../context/DeckReducer";
import { initialDeckState } from "../../context/DeckReducer";
import { deckActionTypes } from "../../context/DeckReducer";
import Deck from "../../components/Deck/Deck";
import { useGlobalState } from "../../context/GlobalStateProvider";
import { CircularProgress } from "@material-ui/core";

type DeckParamsTypes = {
  deckId: string;
};

const DeckContainer = ({ isNewDeck }: any) => {
  return (
    <DeckStateProvider initialState={initialDeckState} reducer={deckReducer}>
      <DeckContainerInner isNewDeck={isNewDeck} />
    </DeckStateProvider>
  );
};

const DeckContainerInner = ({ isNewDeck }: any) => {
  const [{ deck, loading, permissions }, deckDispatch] = useDeckState();
  const [{ user }] = useGlobalState();
  const { deckId }: DeckParamsTypes = useParams();

  useEffect(() => {
    if (isNewDeck) {
      if (loading.deck) {
        deckDispatch({
          type: deckActionTypes.SET_NEW_DECK,
          payload: {
            loading: {
              ...loading,
              canEdit: true,
            },
          },
        });
      }
      return;
    }
    const getDeckById = async (deckId: string) => {
      const docRef = db.collection("decks").doc(deckId);
      const doc = await docRef.get();
      if (doc.exists) {
        docRef.onSnapshot((snapshot: any) => {
          const newDeck = snapshot.data();
          const list = JSON.parse(newDeck.list);
          deckDispatch({
            type: deckActionTypes.SET_DECK,
            payload: {
              id: snapshot.id,
              deck: {
                ...newDeck,
                list: list,
              },
              loading: {
                ...loading,
                deck: false,
              },
            },
          });

          if (user && user.uid === newDeck.user_id) {
            deckDispatch({
              type: deckActionTypes.SET_CAN_EDIT,
              payload: {
                canEdit: true,
              },
            });
          }
          console.log(`Fetched deck: ${deckId}`);
        });
      }
    };
    if (loading.deck) {
      getDeckById(deckId);
    }
  }, [deckId, deckDispatch, loading, user, isNewDeck]);

  if (loading.deck) {
    return (
      <div className="section__loading section__loading--deck">
        <div className="section__loading-message">Loading Deck ...</div>
        <CircularProgress />
      </div>
    );
  }

  return <Deck state={{ deck, permissions, isNewDeck }} />;
};

export default DeckContainer;
