export const initialGlobalState = {
  user: localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser"))
    : null,
};

export const globalActionTypes = {
  SET_USER: "SET_USER",
};

const globalReducer = (state, action) => {
  switch (action.type) {
    case globalActionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default globalReducer;
