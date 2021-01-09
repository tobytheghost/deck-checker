import firebase from "firebase";

import { DeckTypes } from "../types/types";

export type DeckStateTypes = {
  deck: DeckTypes;
  loading: {
    deck: boolean;
  };
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
  };
};

export type DeckActionTypes = {
  type: string;
  payload: {
    [x: string]: any;
  };
};

export const initialDeckState: DeckStateTypes = {
  deck: {
    commander_id: "",
    commander_image: "",
    commander_name: "",
    deck_name: "",
    list: [],
    user_id: "",
    tag: "",
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  },
  loading: {
    deck: true,
  },
  permissions: {
    canEdit: false,
    canDelete: false,
  },
};

export const deckActionTypes = {
  SET_DECK: "SET_DECK",
  SET_CAN_EDIT: "SET_CAN_EDIT",
  SET_LIST: "SET_LIST",
};

const deckReducer = (state: DeckStateTypes, action: DeckActionTypes) => {
  switch (action.type) {
    case deckActionTypes.SET_DECK:
      return {
        ...state,
        deck: action.payload.deck,
        loading: {
          ...state.loading,
          deck: false,
        },
      };
    case deckActionTypes.SET_LIST:
      console.log(state);
      return {
        ...state,
        deck: {
          ...state.deck,
          list: action.payload.list,
        },
      };
    case deckActionTypes.SET_CAN_EDIT:
      return {
        ...state,
        permissions: {
          ...state.permissions,
          canEdit: action.payload.canEdit,
        },
      };
    default:
      return state;
  }
};

export default deckReducer;
