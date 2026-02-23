import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft } from "lucide-react";
import ReceipeCard from "./ReceipeCard";
import { getFavorites } from "../services/favoritesService";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleFavoriteChange = (recipeId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((recipe) => String(recipe.id) !== String(recipeId)));
      return;
    }

    setFavorites(getFavorites());
  };

  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="text-yellow-400 hover:text-yellow-300 flex items-center mb-6 font-medium transition text-lg group"
      >
        <ChevronLeft className="w-6 h-6 mr-1 transition" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl sm:text-4xl font-black text-gray-100 mb-6 flex items-center gap-3">
        <Heart className="w-8 h-8 text-rose-500" />
        Favorite Recipes
      </h1>

      {favorites.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-300">
          No favorites yet. Save recipes using the heart icon.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {favorites.map((recipe) => (
            <ReceipeCard
              key={recipe.id}
              meal={recipe}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Favorites;
