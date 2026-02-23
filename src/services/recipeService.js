const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TheMealDB request failed (${response.status}).`);
  }
  return response.json();
};

const toRecipeCard = (meal) => ({
  id: meal?.idMeal ? Number(meal.idMeal) : meal?.id,
  title: meal?.strMeal || meal?.title || "Untitled Recipe",
  image: meal?.strMealThumb || meal?.image || "",
});

const hasAnyIngredient = (meal, blocked) => {
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = (meal?.[`strIngredient${i}`] || "").toLowerCase().trim();
    if (!ingredient) continue;
    if (blocked.some((item) => ingredient.includes(item))) {
      return true;
    }
  }
  return false;
};

const applyMealdbFilters = (meals, filters) => {
  let next = meals;

  if (filters.vegan) {
    const blocked = [
      "chicken", "beef", "pork", "lamb", "goat", "fish", "salmon", "tuna", "shrimp",
      "prawn", "egg", "milk", "cheese", "cream", "butter", "yogurt", "honey",
    ];
    next = next.filter((meal) => !hasAnyIngredient(meal, blocked));
  } else if (filters.vegetarian) {
    const blocked = ["chicken", "beef", "pork", "lamb", "goat", "fish", "salmon", "tuna", "shrimp", "prawn"];
    next = next.filter((meal) => !hasAnyIngredient(meal, blocked));
  }

  if (filters.glutenFree) {
    const blocked = ["flour", "bread", "pasta", "spaghetti", "noodle", "soy sauce", "wheat", "barley", "rye"];
    next = next.filter((meal) => !hasAnyIngredient(meal, blocked));
  }

  // TheMealDB does not provide calories in search payloads; keep API shape compatible and ignore this filter.
  return next;
};

const hydrateMealsForFiltering = async (meals) => {
  const details = await Promise.all(
    meals.map(async (meal) => {
      const id = meal?.idMeal || meal?.id;
      if (!id) return null;
      const data = await fetchJson(`${BASE_URL}/lookup.php?i=${id}`);
      return data?.meals?.[0] || null;
    })
  );

  return details.filter(Boolean);
};

export const searchRecipes = async (query = "", filters = {}, page = 1) => {
  const pageNumber = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const pageSize = 12;
  const normalizedFilters = {
    vegetarian: Boolean(filters?.vegetarian),
    vegan: Boolean(filters?.vegan),
    glutenFree: Boolean(filters?.glutenFree),
    maxCalories: filters?.maxCalories,
    cuisine: filters?.cuisine || "",
    includeIngredients: filters?.includeIngredients || "",
  };

  let meals = [];

  if (normalizedFilters.cuisine) {
    const data = await fetchJson(`${BASE_URL}/filter.php?a=${encodeURIComponent(normalizedFilters.cuisine)}`);
    meals = data?.meals || [];
  } else if (normalizedFilters.includeIngredients) {
    const data = await fetchJson(
      `${BASE_URL}/filter.php?i=${encodeURIComponent(normalizedFilters.includeIngredients)}`
    );
    meals = data?.meals || [];
  } else if (query) {
    const data = await fetchJson(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    meals = data?.meals || [];
  }

  const needsClientFiltering =
    normalizedFilters.vegetarian || normalizedFilters.vegan || normalizedFilters.glutenFree;

  if (needsClientFiltering && meals.length > 0 && !meals[0]?.strIngredient1) {
    meals = await hydrateMealsForFiltering(meals.slice(0, 60));
  }

  if (needsClientFiltering) {
    meals = applyMealdbFilters(meals, normalizedFilters);
  }

  const offset = (pageNumber - 1) * pageSize;
  return meals.slice(offset, offset + pageSize).map(toRecipeCard);
};

export const getRecipeDetails = async (id) => {
  if (!id) {
    throw new Error("Recipe id is required.");
  }

  const data = await fetchJson(`${BASE_URL}/lookup.php?i=${id}`);
  const meal = data?.meals?.[0];

  if (!meal) {
    throw new Error("Recipe not found.");
  }

  return {
    id: Number(meal.idMeal),
    title: meal.strMeal,
    image: meal.strMealThumb,
    summary: `${meal.strCategory || "Meal"} from ${meal.strArea || "global cuisine"}.`,
    instructions: meal.strInstructions || "",
    readyInMinutes: null,
    servings: null,
    nutrition: {
      nutrients: [],
    },
  };
};
