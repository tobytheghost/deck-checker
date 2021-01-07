import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

// App
import db from "../../firebase/firebase";
import { useGlobalState } from "../../context/GlobalStateProvider";
import {
  ProfileStateProvider,
  useProfileState,
} from "../../context/ProfileStateProvider";
import profileReducer, {
  initialProfileState,
  profileActionTypes,
} from "../../context/ProfileReducer";
import Profile from "../../components/Profile/Profile";

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
  const [{ decks, permissions, filter }, profileDispatch] = useProfileState();
  const { userId }: ProfileParamsTypes = useParams();

  useEffect(() => {
    const unsubscribe = db
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
      unsubscribe();
    };
  }, [userId, user, profileDispatch]);

  const sortDecks = (a: any, b: any) => {
    switch (filter) {
      case "az":
        if (a.data.deck_name < b.data.deck_name) {
          return -1;
        }
        if (a.data.deck_name > b.data.deck_name) {
          return 1;
        }
        return 0;
      case "za":
        if (a.data.deck_name > b.data.deck_name) {
          return -1;
        }
        if (a.data.deck_name < b.data.deck_name) {
          return 1;
        }
        return 0;
      case "format":
        if (a.data.tag < b.data.tag) {
          return -1;
        }
        if (a.data.tag > b.data.tag) {
          return 1;
        }
        return 0;
      case "updatedAsc":
        return a.data.timestamp.seconds - b.data.timestamp.seconds;
      default:
        return b.data.timestamp.seconds - a.data.timestamp.seconds;
    }
  };

  const filteredDecks = decks.sort((a: any, b: any) => sortDecks(a, b));

  return <Profile state={{ decks: filteredDecks, permissions }} />;
};

export default ProfileContainer;
