import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

import { tagTypes } from "../../helpers/decklist";
import { useDeckState } from "../../context/DeckStateProvider";
import { deckActionTypes } from "../../context/DeckReducer";

const DeckPreviewTag = () => {
  const [{ deck }, deckDispatch] = useDeckState();
  const { tag } = deck;

  const handleSelectChange = (e: any) => {
    deckDispatch({
      type: deckActionTypes.SET_DECK_TAG,
      payload: {
        tag: e.target.value,
      },
    });
  };

  return (
    <div className="deck__tag">
      <FormControl variant="outlined">
        <InputLabel id="demo-simple-select-outlined-label">Format</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={tag}
          onChange={handleSelectChange}
          label="Format"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {tagTypes.map((item, i) => {
            return (
              <MenuItem key={i} value={item.label}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default DeckPreviewTag;
