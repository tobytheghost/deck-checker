import React, { createContext, useContext, useReducer } from "react";

export const ProfileStateContext = createContext();

export const ProfileStateProvider = ({ reducer, initialState, children }) => (
  <ProfileStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </ProfileStateContext.Provider>
);

export const useProfileState = () => useContext(ProfileStateContext);
