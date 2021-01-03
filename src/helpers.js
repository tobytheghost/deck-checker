import db from "./firebase";

const parseTextForSymbols = (text) => {
  const regex = /{(.*?)}/g;
  let parsedCost = [];
  text.replace(" // ", "{|}").replaceAll(regex, function (match, string) {
    // return `<i class="ms ms-${string.toLowerCase()}"></i>`;
    parsedCost.push(string.toLowerCase().replace("/", ""));
  });
  return parsedCost;
};

const convertQR = (canvas, imageName) => {
  const pngUrl = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  let downloadLink = document.createElement("a");
  downloadLink.href = pngUrl;
  downloadLink.download = `${imageName}.png`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const checkCardType = (card) => {
  //console.log(card);

  const types = card.type_line;

  if (types.includes("Creature")) {
    return "Creatures";
  }
  if (types.includes("Land")) {
    return "Lands";
  }
  if (types.includes("Instant")) {
    return "Instants";
  }
  if (types.includes("Sorcery")) {
    return "Sorceries";
  }
  if (types.includes("Artifact")) {
    return "Artifacts";
  }
  if (types.includes("Enchantment")) {
    return "Enchantments";
  }
  if (types.includes("Planeswalker")) {
    return "Planeswalkers";
  }
};

const addCardToDeck = (
  list,
  item,
  quantity = 1,
  board = "main",
  limit = null
) => {
  let newDeck = list;
  const cardType = checkCardType(item);
  let checkExistingType = false;
  let typeKey = null;

  newDeck[board + "_quantity"] = newDeck[board + "_quantity"] + quantity;

  for (let i = 0; i < newDeck[board].length; i++) {
    if (newDeck[board][i].type === cardType) {
      checkExistingType = true;
      typeKey = i;
      break;
    }
  }

  if (checkExistingType && typeKey != null) {
    let checkExisting = false;
    let itemKey = null;

    for (let i = 0; i < newDeck[board][typeKey].cards.length; i++) {
      if (newDeck[board][typeKey].cards[i].name === item.name) {
        checkExisting = true;
        itemKey = i;
        break;
      }
    }

    if (checkExisting && itemKey != null) {
      // if (!limit || limit > newDeck[board][typeKey].cards[itemKey].quantity) {
      newDeck[board][typeKey].cards[itemKey].quantity =
        newDeck[board][typeKey].cards[itemKey].quantity + quantity;
      // }
    } else {
      if (item.layout === "transform") {
        newDeck[board][typeKey].cards.push({
          name: item.name,
          cmc: item.cmc,
          mana_cost: item.card_faces[0].mana_cost,
          image: item.card_faces[0].image_uris.normal,
          quantity: quantity,
        });
      } else {
        newDeck[board][typeKey].cards.push({
          name: item.name,
          cmc: item.cmc,
          mana_cost: item.mana_cost,
          image: item.image_uris.normal,
          quantity: quantity,
        });
      }
    }
    // if (!limit || (limit > newDeck[board][typeKey].quantity && checkExisting)) {
    newDeck[board][typeKey].quantity =
      newDeck[board][typeKey].quantity + quantity;
    // }

    newDeck[board][typeKey].cards
      .sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
      .sort((a, b) => {
        if (a.cmc < b.cmc) {
          return -1;
        }
        if (a.cmc > b.cmc) {
          return 1;
        }
        return 0;
      });
  } else {
    if (item.layout === "transform") {
      newDeck[board].push({
        type: cardType,
        quantity: quantity,
        cards: [
          {
            name: item.name,
            cmc: item.cmc,
            mana_cost: item.card_faces[0].mana_cost,
            image: item.card_faces[0].image_uris.normal,
            quantity: quantity,
          },
        ],
      });
    } else {
      newDeck[board].push({
        type: cardType,
        quantity: quantity,
        cards: [
          {
            name: item.name,
            cmc: item.cmc,
            mana_cost: item.mana_cost,
            image: item.image_uris.normal,
            quantity: quantity,
          },
        ],
      });
    }
  }

  newDeck[board].sort((a, b) => {
    if (a.type < b.type) {
      return -1;
    }
    if (a.type > b.type) {
      return 1;
    }
    return 0;
  });

  return newDeck;
};

// const getDeckRatings = (deckId) => {
//   const ratingsRef = db.collection("ratings").where("deck_id", "==", deckId);
//   return ratingsRef.onSnapshot((snapshot) => {
//     if (snapshot.metadata.fromCache) {
//       console.log(true);
//     } else {
//       console.log(false);
//     }
//     return snapshot.docs.map((doc) => ({
//       id: doc.id,
//       data: doc.data(),
//     }));
//   });
// };

const setRating = async (userId, deckId, ownerId, value) => {
  const rating = {
    user_id: userId,
    deck_id: deckId,
    rating: value,
    owner_id: ownerId,
  };
  const docRef = db.collection("ratings").doc(deckId + "_" + userId);
  const doc = await docRef.get();
  if (doc.exists) {
    docRef.update(rating);
  } else {
    docRef.set(rating);
  }
};

export {
  parseTextForSymbols,
  convertQR,
  checkCardType,
  addCardToDeck,
  setRating,
};
