export const initialProfileState = {
  profile: {},
  filter: "updatedDesc",
  decks: [],
  permissions: {
    canEdit: false,
    canDelete: false,
  },
  loading: {
    profile: true,
    decks: true,
  },
};

export const profileActionTypes = {
  SET_PROFILE: "SET_PROFILE",
  SET_FILTER: "SET_FILTER",
  SET_DECKS: "SET_DECKS",
  SET_CAN_EDIT: "SET_CAN_EDIT",
};

const profileReducer = (state, action) => {
  switch (action.type) {
    case profileActionTypes.SET_PROFILE:
      return {
        ...state,
        profile: action.profile,
        loading: {
          ...state.loading,
          profile: false,
        },
      };
    case profileActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    case profileActionTypes.SET_DECKS:
      return {
        ...state,
        decks: action.decks,
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
          canEdit: action.canEdit,
        },
      };
    default:
      return state;
  }
};

export default profileReducer;
