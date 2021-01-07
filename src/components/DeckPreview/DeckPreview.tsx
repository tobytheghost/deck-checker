import React from "react";
import { Card, Chip } from "@material-ui/core";
import { Link } from "react-router-dom";

type DeckPreviewTypes = {
  deck: {
    id: string;
    data: {
      commander_id: string;
      commander_image: string;
      commander_name: string;
      deck_name: string;
      list: string;
      user_id: string;
      tag: string;
      timestamp: any;
    };
  };
  index: number;
};

const DeckPreview = ({ deck, index }: DeckPreviewTypes) => {
  return (
    <div className="profile__deck-wrapper" key={deck.data.timestamp.seconds}>
      <Card variant="outlined" className="profile__card">
        <div className={"profile__deck"}>
          <div className="profile__deck-header">
            <div className="profile__title">
              <h2 className="profile__name">{deck.data.deck_name}</h2>
              <div className="profile__date">
                Last updated: {deck.data.timestamp.toDate().toDateString()}
              </div>
            </div>
            <div className="profile__rating">
              <div className="profile__score">
                {/* {deckRatings[deck.id] ? deckRatings[deck.id] : "-"} */}
              </div>
            </div>
          </div>
          {deck.data.tag && (
            <div className="profile__tags">
              <Chip
                className={
                  "profile__chip profile__chip--" +
                  (deck.data.tag.indexOf("/") !== -1
                    ? deck.data.tag
                        .slice(0, deck.data.tag.indexOf(" "))
                        .toLowerCase()
                    : deck.data.tag.toLowerCase())
                }
                label={deck.data.tag}
              />
            </div>
          )}
          <Link to={`/d/${deck.id}`}>
            <div className="profile__image">
              <img
                width="488"
                key={deck.data.timestamp.seconds}
                className="profile__commander"
                src={deck.data.commander_image || "/card_back.jpg"}
                alt={deck.data.commander_name || deck.data.deck_name}
              />
            </div>
          </Link>
          {/* {user ? (
                      <>
                        <div className="profile__add-score">
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              setRatingWindow(
                                i,
                                deckRatings[deck.id] ? deckRatings[deck.id] : 5
                              )
                            }
                          >
                            Set Power Rating
                          </Button>
                        </div>
                        {openRatingWindow >= 0 && openRatingWindow === i ? (
                          <div className="rating">
                            <div className="rating__info">
                              Rate this deck's power level based on the{" "}
                              <strong>Deck Checker</strong> rating scale found{" "}
                              <a href="#!" target="_blank">
                                here.
                              </a>
                            </div>
                            <div className="rating__buttons">
                              <RemoveCircleIcon
                                className="rating__button rating__button--subtract"
                                onClick={decreaseRating}
                              ></RemoveCircleIcon>
                              <div className="rating__rating">
                                <div className="rating__score">
                                  {currentRating}
                                </div>
                              </div>
                              <AddCircleIcon
                                className="rating__button rating__button--add"
                                onClick={increaseRating}
                              ></AddCircleIcon>
                            </div>
                            <div className="rating__actions">
                              <Button
                                variant="contained"
                                color="primary"
                                className="rating__submit"
                                onClick={() => submitRating(deck.id)}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="outlined"
                                className="rating__submit"
                                onClick={() => setRatingWindow(-1, 0)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      ""
                    )} */}
        </div>
      </Card>
    </div>
  );
};

export default DeckPreview;
