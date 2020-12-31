import firebase from "firebase";

import db from "./firebase";

const parseTextForSymbols = (text) => {
  const regex = /{(.*?)}/g;
  return text.replaceAll(regex, function (match, string) {
    return `<i class="ms ms-${string.toLowerCase()}"></i>`;
  });
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
  console.log(card);

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

const addCardToDeck = (list, item, board = "main", limit = null) => {
  console.log(list, item);
  let newDeck = list;
  const cardType = checkCardType(item);
  let checkExistingType = false;
  let typeKey = null;

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
      if (!limit || limit > newDeck[board][typeKey].cards[itemKey].quantity) {
        newDeck[board][typeKey].cards[itemKey].quantity++;
      }
    } else {
      newDeck[board][typeKey].cards.push({
        name: item.name,
        quantity: 1,
      });
    }
    if (!limit || (limit > newDeck[board][typeKey].quantity && checkExisting)) {
      newDeck[board][typeKey].quantity++;
    }

    newDeck[board][typeKey].cards.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else {
    newDeck[board].push({
      type: cardType,
      quantity: 1,
      cards: [
        {
          name: item.name,
          quantity: 1,
        },
      ],
    });
  }

  return newDeck;
};

export { parseTextForSymbols, convertQR, checkCardType, addCardToDeck };
