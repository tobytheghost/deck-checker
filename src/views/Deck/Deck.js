import React, { useEffect, useState, useMemo, createContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import firebase from "firebase";

import db from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { QR } from "../../components";
import { DeckTabs } from "./components";
import { Error } from "../../views";

import { Card, CircularProgress } from "@material-ui/core";
import "./Deck.scss";

export const DeckContext = createContext(null);

function Deck() {
  const [{ user }] = useStateValue();
  const [deck, setDeck] = useState({});
  const [list, setList] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [isNewDeck, setIsNewDeck] = useState(false);
  const [isError, setIsError] = useState(false);
  const [updateLog, setUpdateLog] = useState([]);
  const [log, setLog] = useState({
    log: "[]",
    timestamp: "",
  });
  const { deckId } = useParams();

  const location = useLocation();

  const providerDeck = useMemo(() => ({ deck, setDeck }), [deck, setDeck]);
  const providerList = useMemo(() => ({ list, setList }), [list, setList]);
  const providerCanEdit = useMemo(() => ({ canEdit, setCanEdit }), [
    canEdit,
    setCanEdit,
  ]);
  const providerLoading = useMemo(() => ({ loading, setLoading }), [
    loading,
    setLoading,
  ]);
  const providerLoadingMessage = useMemo(
    () => ({ loadingMessage, setLoadingMessage }),
    [loadingMessage, setLoadingMessage]
  );
  const providerIsNewDeck = useMemo(() => ({ isNewDeck, setIsNewDeck }), [
    isNewDeck,
    setIsNewDeck,
  ]);
  const providerUpdateLog = useMemo(() => ({ updateLog, setUpdateLog }), [
    updateLog,
    setUpdateLog,
  ]);
  const providerLog = useMemo(() => ({ log, setLog }), [log, setLog]);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = db.collection("decks").doc(deckId);
      const doc = await docRef.get();
      if (doc.exists) {
        docRef.onSnapshot((snapshot) => {
          const deck = snapshot.data();
          if (deck) {
            const list = deck.list || deck.deck;
            setDeck(deck);
            setList(JSON.parse(list));
            if (user && deck && user.uid === deck.user_id) {
              setCanEdit(true);
            }
          }
          setLoading(false);
        });
      } else {
        if (location.pathname === "/add-deck") {
          const newList = {
            main: [],
            main_quantity: 0,
            side: [],
            side_quantity: 0,
            maybe: [],
            maybe_quantity: 0,
          };
          const newDeck = {
            deck_name: "",
            commander_name: "",
            commander_id: "",
            commander_image: "",
            user_id: user.uid,
            list: JSON.stringify(newList),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };
          setDeck(newDeck);
          setList(newList);
          setLoading(false);
          setIsNewDeck(true);
        } else {
          setIsError(true);
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      setDeck(null);
      setList(null);
    };
  }, [user, deckId, location]);

  return (
    <>
      {!isError ? (
        <DeckContext.Provider
          value={{
            providerDeck,
            providerList,
            providerCanEdit,
            providerLoading,
            providerLoadingMessage,
            providerIsNewDeck,
            providerUpdateLog,
            providerLog,
          }}
        >
          {loading ? (
            <div className="section__loading">
              {loadingMessage ? (
                <div className="section__loading-message">{loadingMessage}</div>
              ) : (
                ""
              )}
              <CircularProgress />
            </div>
          ) : (
            <>
              <section className="section section--deck">
                <div className="section__card section__card--full">
                  <Card>
                    <div className="deck">
                      <DeckTabs />
                    </div>
                  </Card>
                </div>
              </section>
              <section className="section">
                {canEdit ? (
                  <div className="section__card">
                    <QR imageName={deckId} qrTitle="Deck QR Code"></QR>
                  </div>
                ) : (
                  <></>
                )}
              </section>
              {/* <SnackBar /> */}
            </>
          )}
        </DeckContext.Provider>
      ) : (
        <Error>Error</Error>
      )}
    </>
  );
}

export default Deck;
