const FAVORITES_EVENT = "favorites-changed";

export const getFavorites = () => {
  try {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to parse favorites:", err);
    return [];
  }
};

export const toggleFavorite = (name) => {
  let favs = getFavorites();

  if (favs.includes(name)) {
    favs = favs.filter((f) => f !== name);
  } else {
    favs.push(name);
  }

  localStorage.setItem("favorites", JSON.stringify(favs));


  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT, { detail: favs }));

  return favs;
};

export const subscribeToFavorites = (callback) => {
  const handler = (event) => {
    const data = event.detail;
    if (Array.isArray(data)) {
      callback(data);
    } else {
      callback(getFavorites());
    }
  };

  window.addEventListener(FAVORITES_EVENT, handler);

  return () => {
    window.removeEventListener(FAVORITES_EVENT, handler);
  };
};
