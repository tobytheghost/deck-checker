import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "@material-ui/core";
import { Chip } from "@material-ui/core";

// App
import Filter from "../../components/ProfileFilter/ProfileFilter";
// import PopupBar from "../../components/PopupBar/PopupBar";
import DeckPreview from "../../components/DeckPreview/DeckPreview";

// Styles
import "./Profile.scss";

type ProfileTypes = {
  //   functions: {};
  state: {
    decks: [];
    permissions: {
      canEdit: boolean;
    };
  };
};

const Profile = ({
  state: {
    decks,
    permissions: { canEdit },
  },
}: ProfileTypes) => {
  return (
    <div className="profile">
      <section className="profile__decks">
        <Card>
          <div className="profile__decks-wrapper profile__decks-wrapper--top">
            <h2 className="profile__subtitle">Decks:</h2>
            <Filter />
          </div>
          <div className="profile__decks-wrapper">
            {!decks.length &&
              (canEdit ? (
                <div className="profile__deck-wrapper profile__deck-wrapper--add">
                  <Card variant="outlined" className="profile__card">
                    <div className="profile__deck ">
                      <Button variant="contained" color="primary">
                        <Link to="/add-deck">Add New Deck</Link>
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="profile__decks-wrapper profile__decks-wrapper--bottom">
                  Nothing to see here ...
                </div>
              ))}
            {decks?.map((deck: any, i: number) => (
              <DeckPreview deck={deck} index={i} />
            ))}
            {canEdit ? (
              <div className="profile__deck-wrapper profile__deck-wrapper--add">
                <Card variant="outlined" className="profile__card">
                  <div className="profile__deck ">
                    <Button variant="contained" color="primary">
                      <Link to="/add-deck">Add New Deck</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <></>
            )}
          </div>
        </Card>
      </section>
      {/* {canEdit ? (
        <section className="profile__info">
          <div className="profile__link">
            <QR imageName={userId} qrTitle="Profile QR Code"></QR>
          </div>
        </section>
      ) : (
        <></>
      )} */}
      {/* <PopupBar /> */}
    </div>
  );
};

export default Profile;
