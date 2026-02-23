import React, { useEffect, useState } from "react";
import { ChevronLeft, Loader } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import ReceipeCard from "./ReceipeCard";
import { searchRecipes } from "../services/recipeService";

const SearchView = () => {
  const { query } = useParams();
  const location = useLocation();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    maxCalories: "",
  });

  const decodedQuery = decodeURIComponent(query || "");
  const searchType = new URLSearchParams(location.search).get("type") || "query";
  const hasNextPage = recipes.length === 12;

  useEffect(() => {
    setPage(1);
  }, [decodedQuery, searchType, selectedFilters]);

  useEffect(() => {
    const loadRecipes = async () => {
      if (!decodedQuery) {
        setRecipes([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        let apiQuery = decodedQuery;
        const filters = {
          vegetarian: selectedFilters.vegetarian,
          vegan: selectedFilters.vegan,
          glutenFree: selectedFilters.glutenFree,
        };

        if (selectedFilters.maxCalories.trim()) {
          filters.maxCalories = selectedFilters.maxCalories.trim();
        }

        if (searchType === "category") {
          apiQuery = "";
          filters.includeIngredients = decodedQuery;
        }

        if (searchType === "cuisine") {
          filters.cuisine = decodedQuery;
        }

        const result = await searchRecipes(apiQuery, filters, page);
        setRecipes(result || []);
      } catch (err) {
        setError(err.message || "Search failed.");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [decodedQuery, searchType, page, selectedFilters]);

  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="text-yellow-400 hover:text-yellow-300 flex items-center mb-6 font-medium transition text-lg group"
      >
        <ChevronLeft className="w-6 h-6 mr-1 transition" />
        Back to Dashboard
      </Link>

      <div className="mb-8 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Filters</h2>
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-2 text-gray-200">
            <input
              type="checkbox"
              checked={selectedFilters.vegetarian}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, vegetarian: e.target.checked }))
              }
            />
            Vegetarian
          </label>

          <label className="inline-flex items-center gap-2 text-gray-200">
            <input
              type="checkbox"
              checked={selectedFilters.vegan}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, vegan: e.target.checked }))
              }
            />
            Vegan
          </label>

          <label className="inline-flex items-center gap-2 text-gray-200">
            <input
              type="checkbox"
              checked={selectedFilters.glutenFree}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, glutenFree: e.target.checked }))
              }
            />
            Gluten Free
          </label>

          <label className="inline-flex items-center gap-2 text-gray-200">
            Max Calories
            <input
              type="number"
              min="1"
              value={selectedFilters.maxCalories}
              onChange={(e) =>
                setSelectedFilters((prev) => ({ ...prev, maxCalories: e.target.value }))
              }
              className="w-28 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-gray-100"
            />
          </label>
        </div>
      </div>

      {loading && (
        <div className="text-center p-8 text-gray-300">
          <Loader className="animate-spin inline-block mr-2 text-blue-400" />
          Searching the database...
        </div>
      )}

      {!loading && error && <p className="text-red-400 text-center py-6">{error}</p>}

      {!loading && !error && recipes.length === 0 && (
        <p className="text-gray-400 text-center py-6">No recipes found for "{decodedQuery}".</p>
      )}

      {!loading && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {recipes.map((meal) => (
            <ReceipeCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
          >
            Previous
          </button>
          <span className="text-gray-300">Page {page}</span>
          <button
            type="button"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default SearchView;
