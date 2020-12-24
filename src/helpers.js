const parseTextForSymbols = (text) => {
  const regex = /{(.*?)}/g;
  return text.replaceAll(regex, function (match, string) {
    return `<i class="ms ms-${string.toLowerCase()}"></i>`;
  });
};

export { parseTextForSymbols };
