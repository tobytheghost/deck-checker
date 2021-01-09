import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// App
import db from "../../firebase/firebase";
import { useGlobalState } from "../../context/GlobalStateProvider";
import { ProfileStateProvider } from "../../context/ProfileStateProvider";
import { useProfileState } from "../../context/ProfileStateProvider";
import profileReducer from "../../context/ProfileReducer";
import { initialProfileState } from "../../context/ProfileReducer";
import { profileActionTypes } from "../../context/ProfileReducer";
import Profile from "../../components/Profile/Profile";
import PopupBar from "../../components/PopupBar/PopupBar";

type ProfileParamsTypes = {
  userId: string;
};

const ProfileContainer = () => {
  return (
    <ProfileStateProvider
      initialState={initialProfileState}
      reducer={profileReducer}
    >
      <ProfileContainerInner />
    </ProfileStateProvider>
  );
};

const ProfileContainerInner = () => {
  const [{ user }] = useGlobalState();
  const [
    { decks, permissions, filter, loading },
    profileDispatch,
  ] = useProfileState();
  const { userId }: ProfileParamsTypes = useParams();

  useEffect(() => {
    const unsubscribeDecks = db
      .collection("decks")
      .where("user_id", "==", userId)
      .onSnapshot((snapshot) => {
        const decks = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            data: doc.data(),
          };
        });
        profileDispatch({
          type: profileActionTypes.SET_DECKS,
          decks: decks,
        });
        console.log(`Fetched decks for user ${userId}`);
      });

    if (user && userId === user.uid) {
      profileDispatch({
        type: profileActionTypes.SET_CAN_EDIT,
        canEdit: true,
      });
    }

    return () => {
      unsubscribeDecks();
    };
  }, [userId, user, profileDispatch]);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupStatus, setPopupStatus] = useState("");
  const [popupMessage, setPopupMessage] = useState("");

  const testButton = () => {
    setPopupMessage("TEST!");
    setPopupStatus("success");
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const sortDecksByFilter = (a: any, b: any) => {
    switch (filter) {
      case "az":
        if (a.data.deck_name > b.data.deck_name) {
          return 1;
        }
        if (a.data.deck_name < b.data.deck_name) {
          return -1;
        }
        return 0;
      case "za":
        if (a.data.deck_name < b.data.deck_name) {
          return 1;
        }
        if (a.data.deck_name > b.data.deck_name) {
          return -1;
        }
        return 0;
      case "format":
        if (a.data.tag > b.data.tag) {
          return 1;
        }
        if (a.data.tag < b.data.tag) {
          return -1;
        }
        return 0;
      case "updatedAsc":
        return a.data.timestamp.seconds - b.data.timestamp.seconds;
      default:
        return b.data.timestamp.seconds - a.data.timestamp.seconds;
    }
  };

  const filteredDecks = decks.sort((a: any, b: any) => sortDecksByFilter(a, b));

  return (
    <>
      <Profile
        state={{ decks: filteredDecks, permissions, userId, loading }}
        functions={{ testButton }}
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

export default ProfileContainer;
