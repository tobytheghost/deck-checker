type ProfileStateTypes = {
  profile: {};
  filter: string;
  decks: [];
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
  };
  loading: {
    profile: boolean; // Set to false as no profile information is being loaded
    decks: boolean;
  };
};

type ProfileActionTypes = {
  type: string;
  payload: {
    [x: string]: any;
  };
};

export const initialProfileState: ProfileStateTypes = {
  profile: {},
  filter: "updatedDesc",
  decks: [],
  permissions: {
    canEdit: false,
    canDelete: false,
  },
  loading: {
    profile: false, // Set to false as no profile information is being loaded
    decks: true,
  },
};

export const profileActionTypes = {
  SET_PROFILE: "SET_PROFILE",
  SET_FILTER: "SET_FILTER",
  SET_DECKS: "SET_DECKS",
  SET_CAN_EDIT: "SET_CAN_EDIT",
};

const profileReducer = (
  state: ProfileStateTypes,
  action: ProfileActionTypes
) => {
  switch (action.type) {
    case profileActionTypes.SET_PROFILE:
      return {
        ...state,
        profile: action.payload.profile,
        loading: {
          ...state.loading,
          profile: false,
        },
      };
    case profileActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload.filter,
      };
    case profileActionTypes.SET_DECKS:
      return {
        ...state,
        decks: action.payload.decks,
        loading: {
          ...state.loading,
          decks: false,
        },
      };
    case profileActionTypes.SET_CAN_EDIT:
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

export default profileReducer;
