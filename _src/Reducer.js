export const initialState = {
  user: localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser"))
    : null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_DECK: "SET_DECK",
};

const reducer = (state, action) => {
  //console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_DECK:
      return {
        ...state,
        deck: action.deck,
      };
    default:
      return state;
  }
};

export default reducer;
