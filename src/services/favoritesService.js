const FAVORITES_STORAGE_KEY = "favoriteRecipes";

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

const normalizeRecipe = (recipe) => {
  const id = recipe?.id ?? recipe?.idMeal;
  if (!id) return null;

  return {
    id,
    title: recipe?.title ?? recipe?.strMeal ?? "Untitled Recipe",
    image: recipe?.image ?? recipe?.strMealThumb ?? "",
  };
};

export const getFavorites = () => {
  if (!canUseStorage()) return [];

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

export const isFavorite = (id) => {
  if (!id) return false;
  return getFavorites().some((item) => String(item.id) === String(id));
};

export const toggleFavorite = (recipe) => {
  const normalized = normalizeRecipe(recipe);
  if (!normalized) return false;

  const favorites = getFavorites();
  const exists = favorites.some((item) => String(item.id) === String(normalized.id));

  if (exists) {
    const next = favorites.filter((item) => String(item.id) !== String(normalized.id));
    saveFavorites(next);
    return false;
  }

  saveFavorites([...favorites, normalized]);
  return true;
};

export const removeFavorite = (id) => {
  if (!id) return;
  const next = getFavorites().filter((item) => String(item.id) !== String(id));
  saveFavorites(next);
};
