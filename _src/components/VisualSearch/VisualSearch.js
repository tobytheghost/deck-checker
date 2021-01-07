import React, { useState, useEffect } from "react";
import "./VisualSearch.scss";

function VisualSearch() {
  const [input, setInput] = useState("");
  const [cardList, setCardList] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [cardPreview, setCardPreview] = useState({ name: "", url: "" });

  const searchUrl = "https://api.scryfall.com/cards/search?q=";
  const searchCards = (search) => {
    //console.log(`Searching for ${search}`);
    fetch(searchUrl + search)
      .then((response) => response.json())
      .then((data) => {
        setCardList(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (input.length > 2) {
        setLoading(true);
        searchCards(input);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [input]);

  return (
    <div className="search search--visual">
      <div className="search__main">
        <input
          className="search__search"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        {loading ? (
          <div>Searching ...</div>
        ) : input.length > 2 && cardList.data.length > 0 ? (
          <ul className="search__list search__list--grid">
            {cardList.data
              .filter((item, i) => {
                if (!input) return true;
                if (item.name.toLowerCase().includes(input.toLowerCase())) {
                  return true;
                }
                return false;
              })
              .slice(0, 100)
              .map((item, i) => (
                <li className="search__item" key={i}>
                  <a
                    href={item.image_uris.normal}
                    onMouseOver={() =>
                      setCardPreview({
                        name: item.name,
                        url: item.image_uris.border_crop,
                      })
                    }
                  >
                    <img src={item.image_uris.small} alt={item.name} />
                  </a>
                </li>
              ))}
          </ul>
        ) : (
          <></>
        )}
      </div>
      <div className="search__preview">
        {cardPreview.name ? (
          <img
            className="search__image"
            src={cardPreview.url}
            alt={cardPreview.name}
          />
        ) : (
          <img className="search__image" src="/card_back.jpg" alt="Card Back" />
        )}
      </div>
    </div>
  );
}

export default VisualSearch;
