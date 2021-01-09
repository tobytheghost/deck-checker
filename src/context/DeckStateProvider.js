import React, { createContext, useContext, useReducer } from "react";

export const DeckStateContext = createContext();

export const DeckStateProvider = ({ reducer, initialState, children }) => (
  <DeckStateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </DeckStateContext.Provider>
);

export const useDeckState = () => useContext(DeckStateContext);
