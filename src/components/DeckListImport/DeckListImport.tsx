import React from "react";
import { Button, TextField } from "@material-ui/core";

type DeckListImportTypes = {
  functions: {
    handleImportOnChange: (event: any) => void;
    runImport: () => void;
  };
  state: {
    importCards: any;
  };
};
const DeckListImport = ({
  functions: { handleImportOnChange, runImport },
  state: { importCards },
}: DeckListImportTypes) => {
  return (
    <div className="section__card section__card--import">
      {/* <Card className="deck__card"> */}
      <section className="deck__actions deck__actions--top">
        <div className="deck__action deck__action--info">
          <h3 className="deck__action-title">Add card(s) from list:</h3>
          <div className="deck__action-info">
            Import cards in the following format:{" "}
            <pre>
              1 Forest
              <br />1 Island
              <br />1 Swamp
            </pre>
            Cards listed below a blank line or the word `Sideboard` will add to
            the sideboard.
          </div>
        </div>
        <div className="deck__action deck__action--search">
          <TextField
            label="Import cards from list"
            variant="outlined"
            name="importCards"
            multiline
            value={importCards}
            onChange={handleImportOnChange}
          />
        </div>
        <div className="deck__import">
          <Button variant="contained" color="primary" onClick={runImport}>
            Import
          </Button>
        </div>
      </section>
      {/* </Card> */}
    </div>
  );
};

export default DeckListImport;
