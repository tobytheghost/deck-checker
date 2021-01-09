import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const DeckPreviewTag = () => {
  return (
    <div className="deck__tag">
      {/* <FormControl variant="outlined" className={classes.formControl}>
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
          {menuItems.map((item, i) => {
            return (
              <MenuItem key={i} value={item.label}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl> */}
    </div>
  );
};

export default DeckPreviewTag;
