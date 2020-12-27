import React, { useState, useEffect } from "react";

// App
import db from "../../firebase";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { QR, DeckList } from "../../components";
import { Error } from "../../views";
import { useStateValue } from "../../StateProvider";

// Styles
import {
  Card,
  Tab,
  Tabs,
  AppBar,
  CircularProgress,
  Button,
} from "@material-ui/core";
import "./Deck.scss";

function TabPanel(props) {
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
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Deck() {
  // eslint-disable-next-line
  const [{ user }, dispatch] = useStateValue();
  const [deck, setDeck] = useState({});
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const { deckId } = useParams();
  const [value, setValue] = useState(0);

  const exampleDeck = {
    main: [
      {
        type: "Creatures",
        quantity: 16,
        cards: [
          {
            name: "Scourge of the Skyclaves",
            quantity: 4,
          },
          {
            name: "Deaths Shadow",
            quantity: 4,
          },
          {
            name: "Monastery Swiftspear",
            quantity: 4,
          },
          {
            name: "Tarmogoyf",
            quantity: 4,
          },
        ],
      },
      {
        type: "Instants",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Sorceries",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Enchantments",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Artifacts",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
      {
        type: "Lands",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
    ],
    side: [
      {
        type: "Creatures",
        quantity: 1,
        cards: [
          {
            name: "Lurrus of the Dream-Den",
            quantity: 1,
          },
        ],
      },
      {
        type: "Lands",
        quantity: 4,
        cards: [
          {
            name: "Lightning Bolt",
            quantity: 4,
          },
        ],
      },
    ],
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const unsubscribe = db
      // .collection("users")
      // .doc(userId)
      .collection("decks")
      .doc(deckId)
      .onSnapshot((snapshot) => {
        //console.log(snapshot.data());
        setDeck(snapshot.data());
        if (snapshot.data() && user.uid === snapshot.data().userId) {
          setCanEdit(true);
        }
        setLoading(false);
      });

    return () => {
      unsubscribe();
    };
  }, [user, deckId]);

  return (
    <>
      {!loading ? (
        <>
          {deck ? (
            <>
              {canEdit ? (
                <section className="profile__actions">
                  <Card>
                    <ul>
                      <li className="profile__action">
                        <Button variant="contained" color="primary">
                          Edit Deck
                        </Button>
                      </li>
                    </ul>
                  </Card>
                </section>
              ) : (
                <></>
              )}
              <section className="section section--deck">
                <div className="section__card section__card--full">
                  <Card>
                    <div className="deck">
                      <AppBar position="static">
                        <Tabs value={value} onChange={handleChange}>
                          <Tab label="Decklist" {...a11yProps(0)} />
                          <Tab
                            label="Deck Updates"
                            disabled
                            {...a11yProps(1)}
                          />
                          <Tab label="Stats" disabled {...a11yProps(2)} />
                        </Tabs>
                      </AppBar>
                      <TabPanel value={value} index={0}>
                        <div className="deck__section deck__section--decklist">
                          <div className="deck__preview">
                            <h2 className="deck__name">{deck.commander}</h2>
                            <div className="deck__image">
                              <img
                                className="decks__commander"
                                src={deck.commander_image}
                                alt={deck.commander}
                              />
                            </div>
                          </div>
                          <DeckList deck={exampleDeck} />
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <div className="deck__section">Here</div>
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <div className="deck__section">Here</div>
                      </TabPanel>
                    </div>
                  </Card>
                </div>
                <div className="section__card">
                  <QR imageName={deckId} qrTitle="Deck QR Code"></QR>
                </div>
              </section>
            </>
          ) : (
            <Error></Error>
          )}
        </>
      ) : (
        <div className="section__loading">
          <CircularProgress />
        </div>
      )}
    </>
  );
}

export default Deck;
