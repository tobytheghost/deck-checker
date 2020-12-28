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

export { parseTextForSymbols, convertQR, checkCardType };
