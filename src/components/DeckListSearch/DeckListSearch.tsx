import React from "react";
import { Button, TextField } from "@material-ui/core";
// @ts-ignore
import { Mana } from "@saeris/react-mana";

import { parseTextForSymbols } from "../../helpers/decklist";

type DeckListSearchTypes = {
  functions: {
    addCardFromSearch: (
      item: any,
      board: string,
      cardType: string | null
    ) => void;
    handleSearchOnChange: (event: any) => void;
    handleClearSearch: () => void;
    handleSetDeckImage: (item: any) => void;
  };
  state: {
    searchQuery: string;
    cardList: any;
  };
  loading: {
    searching: boolean;
  };
};
const DeckListSearch = ({
  functions: {
    handleSearchOnChange,
    handleClearSearch,
    addCardFromSearch,
    handleSetDeckImage,
  },
  state: { searchQuery, cardList },
  loading: { searching },
}: DeckListSearchTypes) => {
  return (
    <>
      <div className="section__card section__card--search">
        {/* <Card className="deck__card"> */}
        <section className="deck__actions deck__actions--top">
          <div className="deck__action deck__action--info">
            <h3 className="deck__action-title">Add card(s) using search:</h3>
            <div className="deck__action-info">
              Search for cards using the card database.
            </div>
          </div>
          <div className="deck__action deck__action--search">
            <TextField
              label="Search"
              variant="outlined"
              name="addCard"
              type="text"
              placeholder="Search Cards ..."
              value={searchQuery}
              onChange={handleSearchOnChange}
            />
            <div className="deck__clear-button">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleClearSearch}
              >
                Clear Search
              </Button>
            </div>
          </div>
          {searching ? (
            <div className="deck__search-list">Searching ...</div>
          ) : searchQuery.length > 2 && cardList.length > 0 ? (
            <ul className="deck__search-list">
              {cardList
                .filter((item: any) => {
                  if (!searchQuery) return true;
                  if (
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  ) {
                    return true;
                  }
                  return false;
                })
                .slice(0, 100)
                .map((item: any) => (
                  <li className="deck__search-item" key={item.name}>
                    <span>
                      <div className="deck__search-name">{item.name}</div>
                      <div className="deck__search-mana">
                        {item.mana_cost
                          ? parseTextForSymbols(item.mana_cost).map(
                              (symbol, i) => {
                                if (symbol === "|") {
                                  return (
                                    <span className="decklist__mana-split">
                                      {"//"}
                                    </span>
                                  );
                                } else {
                                  return (
                                    <Mana
                                      key={i}
                                      symbol={symbol}
                                      shadow
                                      fixed
                                      size="1x"
                                    />
                                  );
                                }
                              }
                            )
                          : ""}
                      </div>
                      <div className="deck__search-buttons">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            addCardFromSearch(item, "Main Deck", null);
                          }}
                        >
                          Add Main
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            addCardFromSearch(item, "Sideboard", null);
                          }}
                        >
                          Add Side
                        </Button>
                        {/* <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            addCardFromSearch(item, "Maybeboard", null);
                          }}
                        >
                          Add Maybe
                        </Button> */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            addCardFromSearch(item, "Main Deck", "Commander");
                          }}
                        >
                          Set Commander
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            handleSetDeckImage(item);
                          }}
                        >
                          Set Image
                        </Button>
                      </div>
                    </span>
                  </li>
                ))}
            </ul>
          ) : cardList.length ? (
            <div className="search__list"></div>
          ) : (
            <></>
          )}
        </section>
        {/* </Card> */}
      </div>
    </>
  );
};

export default DeckListSearch;
