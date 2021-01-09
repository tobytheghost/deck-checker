import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

// App
import { useProfileState } from "../../context/ProfileStateProvider";
import { profileActionTypes } from "../../context/ProfileReducer";

const ProfileFilter = () => {
  const [{ filter }, profileDispatch] = useProfileState();

  const handleSelectChange = (e: any) => {
    profileDispatch({
      type: profileActionTypes.SET_FILTER,
      payload: {
        filter: e.target.value,
      },
    });
  };

  const filterBy = [
    {
      label: "Last Updated (Desc)",
      value: "updatedDesc",
    },
    {
      label: "Last Updated (Asc)",
      value: "updatedAsc",
    },
    // {
    //   label: "Power Rating (Desc)",
    //   value: "powerDesc",
    // },
    // {
    //   label: "Power Rating (Asc)",
    //   value: "powerAsc",
    // },
    {
      label: "A-Z",
      value: "az",
    },
    {
      label: "Z-A",
      value: "za",
    },
    {
      label: "Format",
      value: "format",
    },
  ];

  return (
    <FormControl variant="outlined">
      <InputLabel id="demo-simple-select-outlined-label">Sort By</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={filter}
        onChange={handleSelectChange}
        label="Format"
      >
        {filterBy.map((item, i) => {
          return (
            <MenuItem key={i} value={item.value}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default ProfileFilter;
