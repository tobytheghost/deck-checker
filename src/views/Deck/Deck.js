import React, { useEffect, useState, useMemo, createContext } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase";

import db from "../../firebase";
import { useStateValue } from "../../StateProvider";
import { QR } from "../../components";
import { Search, SnackBar, DeckTabs } from "./components";

import { Card, CircularProgress } from "@material-ui/core";
import "./Deck.scss";

export const DeckContext = createContext(null);

function Deck() {
  const [{ user }] = useStateValue();
  const [deck, setDeck] = useState({});
  const [list, setList] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const { deckId } = useParams();

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

  useEffect(() => {
    const fetchData = async () => {
      const docRef = db.collection("decks").doc(deckId);
      const doc = await docRef.get();
      if (doc.exists) {
        docRef.onSnapshot((snapshot) => {
          const deck = snapshot.data();
          const list = deck.list || deck.deck;
          setDeck(deck);
          setList(JSON.parse(list));
          if (user && deck && user.uid === deck.user_id) {
            setCanEdit(true);
          }
          setLoading(false);
        });
      } else {
        const newList = {
          main: [],
          side: [],
          maybe: [],
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
      }
    };
    fetchData();

    return () => {
      setDeck(null);
      setList(null);
    };
  }, [user, deckId]);

  return (
    <DeckContext.Provider
      value={{ providerDeck, providerList, providerCanEdit, providerLoading }}
    >
      {loading ? (
        <div className="section__loading">
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
            <Search />
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
  );
}

export default Deck;
