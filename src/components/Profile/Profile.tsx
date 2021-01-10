import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "@material-ui/core";

// App
import Filter from "../../components/ProfileFilter/ProfileFilter";
import QR from "../../components/QR/QR";
import ProfileDeckPreviewContainer from "../../containers/ProfileDeckPreviewContainer/ProfileDeckPreviewContainer";

// Styles
import "./Profile.scss";

type ProfileTypes = {
  functions: {
    testButton: () => void;
  };
  state: {
    decks: [];
    permissions: {
      canEdit: boolean;
    };
    loading: {
      profile: boolean;
      decks: boolean;
    };
    userId: string;
  };
};

const Profile = ({
  functions: { testButton },
  state: {
    decks,
    permissions: { canEdit },
    loading,
    userId,
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
              (loading.decks ? (
                <div className="profile__decks-wrapper profile__decks-wrapper--bottom">
                  Loading ...
                </div>
              ) : (
                <div className="profile__decks-wrapper profile__decks-wrapper--bottom">
                  Nothing to see here ...
                </div>
              ))}
            {decks?.map((deck: any) => {
              //console.log(deck);
              return <ProfileDeckPreviewContainer deck={deck} key={deck.id} />;
            })}
            {canEdit && !loading.decks && (
              <div className="profile__deck-wrapper profile__deck-wrapper--add">
                <Card variant="outlined" className="profile__card">
                  <div className="profile__deck ">
                    <Button variant="contained" color="primary">
                      <Link to="/add-deck">Add New Deck</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      </section>
      {canEdit && (
        <section className="profile__info">
          <div className="profile__link">
            <QR imageName={userId} qrTitle="Profile QR Code"></QR>
          </div>
        </section>
      )}
      {/* <button onClick={testButton}>TEST</button> */}
    </div>
  );
};

export default Profile;
