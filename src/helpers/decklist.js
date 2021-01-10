export const cardGroups = [
  "Commander",
  "Artifacts",
  "Creatures",
  "Enchantments",
  "Instants",
  "Sorceries",
  "Planeswalkers",
  "Lands",
];

export const boards = ["Main Deck", "Sideboard", "Maybeboard"];

export const parseTextForSymbols = (text) => {
  const regex = /{(.*?)}/g;
  let parsedCost = [];
  text.replace(" // ", "{|}").replaceAll(regex, function (match, string) {
    // return `<i class="ms ms-${string.toLowerCase()}"></i>`;
    parsedCost.push(string.toLowerCase().replace("/", ""));
  });
  return parsedCost;
};

export const checkCardType = (card) => {
  const types = card.type_line;
  if (types.includes("Creature")) {
    return "Creatures";
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
  if (types.includes("Land")) {
    return "Lands";
  }
  return "";
};

export const formatCard = (card, board, quantity, type) => {
  if (card.layout !== "transform") {
    return {
      name: card.name,
      cmc: card.cmc,
      quantity: quantity,
      board: board,
      type: type,
      layout: card.layout,
      mana_cost: card.mana_cost,
      image: card.image_uris.normal,
    };
  }
  return {
    name: card.name,
    cmc: card.cmc,
    quantity: quantity,
    board: board,
    type: type,
    layout: card.layout,
    mana_cost: card.card_faces[0].mana_cost,
    image: card.card_faces[0].image_uris.normal,
  };
};

export const tagTypes = [
  {
    label: "Brawl",
    value: "brawl",
  },
  {
    label: "EDH / Commander",
    value: "edh",
  },
  {
    label: "Historic",
    value: "historic",
  },
  {
    label: "Legacy",
    value: "legacy",
  },
  {
    label: "Modern",
    value: "modern",
  },
  {
    label: "Pauper",
    value: "pauper",
  },
  {
    label: "Pioneer",
    value: "pioneer",
  },
  {
    label: "Standard",
    value: "standard",
  },
  {
    label: "Vintage",
    value: "vintage",
  },
];
