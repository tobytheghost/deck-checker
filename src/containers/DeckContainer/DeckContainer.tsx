import React from "react";
import firebase from "firebase";

// App
import db from "../../firebase/firebase";

const DeckContainer = () => {
  const getDeckByRef = async (
    docRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
  ) => {
    const doc = await docRef.get();
    if (doc.exists) {
      docRef.onSnapshot((snapshot: any) => {});
      //deckDispatch({});
    }
  };

  const getDeckById = async (deckId: string) => {
    const docRef = db.collection("decks").doc(deckId);
    return await getDeckByRef(docRef);
  };

  return <div></div>;
};

export default DeckContainer;
