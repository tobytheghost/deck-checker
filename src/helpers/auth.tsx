import { globalActionTypes } from "../context/GlobalReducer";
import { auth, provider } from "../firebase/firebase";

export const logout = (globalDispatch: ({}) => void) => {
  globalDispatch({
    type: globalActionTypes.SET_USER,
    user: null,
  });
  localStorage.setItem("authUser", "");
};

export const login = (globalDispatch: ({}) => void) => {
  auth
    .signInWithPopup(provider)
    .then((result) => {
      globalDispatch({
        type: globalActionTypes.SET_USER,
        user: result.user,
      });
      localStorage.setItem("authUser", JSON.stringify(result.user));
    })
    .catch((error) => alert(error.message));
};
