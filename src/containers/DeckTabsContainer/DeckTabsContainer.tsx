import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, AppBar } from "@material-ui/core";

// App
import DeckListContainer from "../../containers/DeckListContainer/DeckListContainer";
// import Logs from "./Logs/Logs";

// Styles

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const DeckTabsContainer = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTabValue(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleChange}>
          <Tab label="Decklist" {...a11yProps(0)} />
          <Tab label="Deck Updates" disabled {...a11yProps(1)} />
          <Tab label="Stats" disabled {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <div className="deck__section deck__section--decklist">
          <DeckListContainer />
        </div>
      </TabPanel>
      {/* <TabPanel value={tabValue} index={1}>
        <div className="deck__section">
			<Logs />
		</div>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <div className="deck__section">Here</div>
      </TabPanel> */}
    </>
  );
};

export default DeckTabsContainer;
