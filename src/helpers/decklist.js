export const cardGroups = [
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
