import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

import db from "../../../../../firebase";
import { DeckContext } from "../../../Deck";

function Logs() {
  const {
    providerLog: { log, setLog },
  } = useContext(DeckContext);

  const { deckId } = useParams();

  useEffect(() => {
    //setLoading(true);
    const fetchData = async () => {
      const docRef = db.collection("deckLogs").doc(deckId);
      const doc = await docRef.get();
      if (doc.exists) {
        docRef.onSnapshot((snapshot) => {
          const deckLog = snapshot.data();
          console.log(deckLog);
          if (deckLog) {
            setLog(deckLog);
          }
        });
      }
      //setLoading(false);
    };
    fetchData();
  }, [deckId, setLog]);

  const parseJSON = (json) => {
    return JSON.parse(json);
  };

  return (
    <div>
      {console.log(log.log)}
      <div>
        {log.log
          ? parseJSON(log.log).map((item) => {
              console.log(parseJSON(item.log));
              return (
                <>
                  <div>{item.timestamp.slice(0, 10)}</div>
                  <ul>
                    {parseJSON(item.log).map((line, i) => {
                      if (line.quantity === 0) {
                        return <></>;
                      }
                      return (
                        <li key={i}>
                          {line.quantity > 0 ? "+" : ""}
                          {line.quantity} {line.name}
                        </li>
                      );
                    })}
                  </ul>
                </>
              );
            })
          : ""}
      </div>
    </div>
  );
}

export default Logs;
