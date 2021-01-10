import React, { useEffect, useState } from "react";

import DeckPreview from "../../components/DeckPreview/DeckPreview";
import db from "../../firebase/firebase";
import { useGlobalState } from "../../context/GlobalStateProvider";
import PopupBar from "../../components/PopupBar/PopupBar";
import { DeckTypes } from "../../types/types";

type ProfileDeckPreviewContainerTypes = {
  deck: {
    id: string;
    data: DeckTypes;
  };
};

type Rating = {
  deck_id: string;
  owner_id: string;
  user_id: string;
  rating: number;
};

const ProfileDeckPreviewContainer = ({
  deck,
}: ProfileDeckPreviewContainerTypes) => {
  const [rating, setRating] = useState<string | number>("");
  const [{ user }, globalDispatch] = useGlobalState();
  const { id } = deck;

  useEffect(() => {
    const unsubscribeRatings = db
      .collection("ratings")
      .where("deck_id", "==", id)
      .onSnapshot((snapshot) => {
        const ratings = snapshot.docs.map((doc, i) => {
          const data = doc.data();
          return data.rating;
        });
        setRating(
          ratings.length
            ? ratings.reduce((total, val) => total + val) / snapshot.docs.length
            : "-"
        );
      });
    return () => {
      unsubscribeRatings();
    };
  }, [id]);

  const handleSubmitRating = async (deckId: string, rating: number) => {
    if (!user || !user.uid) {
      setPopupMessage("Failed to submit rating");
      setPopupStatus("error");
      setPopupOpen(true);
      return;
    }
    const newRating: Rating = {
      user_id: user.uid,
      deck_id: deckId,
      rating: rating,
      owner_id: deck.data.user_id,
    };
    const docRef = db.collection("ratings").doc(deckId + "_" + user.uid);
    const doc = await docRef.get();
    if (doc.exists) {
      docRef.update(newRating);
      setPopupMessage("Rating updated");
      setPopupStatus("success");
      setPopupOpen(true);
    } else {
      docRef.set(newRating);
      setPopupMessage("Rating submitted");
      setPopupStatus("success");
      setPopupOpen(true);
    }
  };

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupStatus, setPopupStatus] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  //console.log(deck);

  return (
    <>
      <DeckPreview
        deck={deck}
        rating={rating}
        functions={{ handleSubmitRating }}
      />
      <PopupBar
        open={popupOpen}
        message={popupMessage}
        status={popupStatus}
        handlePopupClose={handlePopupClose}
      />
    </>
  );
};

export default ProfileDeckPreviewContainer;
