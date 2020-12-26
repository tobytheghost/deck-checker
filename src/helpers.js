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

export { parseTextForSymbols, convertQR };
