import firebase from "firebase";

import { DeckTypes } from "../types/types";

export type DeckStateTypes = {
  id: string;
  deck: DeckTypes;
  loading: {
    deck: boolean;
  };
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
  };
  isNewDeck: boolean;
};

export type DeckActionTypes = {
  type: string;
  payload: {
    [x: string]: any;
  };
};

export const initialDeckState: DeckStateTypes = {
  id: "",
  deck: {
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
  isNewDeck: false,
};

export const deckActionTypes = {
  SET_DECK: "SET_DECK",
  SET_CAN_EDIT: "SET_CAN_EDIT",
  SET_LIST: "SET_LIST",
  SET_NEW_DECK: "SET_NEW_DECK",
  SET_DECK_TAG: "SET_DECK_TAG",
  SET_DECK_IMAGE: "SET_DECK_IMAGE",
  SET_DECK_NAME: "SET_DECK_NAME",
};

const deckReducer = (state: DeckStateTypes, action: DeckActionTypes) => {
  switch (action.type) {
    case deckActionTypes.SET_DECK:
      return {
        ...state,
        id: action.payload.id,
        deck: action.payload.deck,
        loading: {
          ...state.loading,
          deck: false,
        },
      };
    case deckActionTypes.SET_NEW_DECK:
      return {
        ...state,
        loading: {
          ...state.loading,
          deck: false,
        },
        permissions: {
          ...state.permissions,
          canEdit: action.payload.canEdit,
        },
        isNewDeck: true,
      };
    case deckActionTypes.SET_DECK_TAG:
      return {
        ...state,
        deck: {
          ...state.deck,
          tag: action.payload.tag,
        },
      };
    case deckActionTypes.SET_DECK_NAME:
      return {
        ...state,
        deck: {
          ...state.deck,
          deck_name: action.payload.deck_name,
        },
      };
    case deckActionTypes.SET_LIST:
      //console.log(state);
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
    case deckActionTypes.SET_DECK_IMAGE:
      return {
        ...state,
        deck: {
          ...state.deck,
          commander_image: action.payload.commander_image,
          commander_name: action.payload.commander_name,
        },
      };
    default:
      return state;
  }
};

export default deckReducer;
