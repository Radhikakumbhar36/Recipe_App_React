import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { isFavorite, toggleFavorite } from "../services/favoritesService";

const ReceipeCard = ({ meal, onFavoriteChange }) => {
  const recipeId = meal?.id ?? meal?.idMeal;
  const title = meal?.title ?? meal?.strMeal;
  const image = meal?.image ?? meal?.strMealThumb;
  const [favorite, setFavorite] = useState(false);

  if (!recipeId) return null;

  useEffect(() => {
    setFavorite(isFavorite(recipeId));
  }, [recipeId]);

  const onToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const nextState = toggleFavorite({ id: recipeId, title, image });
    setFavorite(nextState);
    onFavoriteChange?.(recipeId, nextState);
  };

  return (
    <div
      className="relative bg-gray-900 rounded-xl shadow-xl shadow-black/50 overflow-hidden 
    group transform transition duration-500 cursor-pointer border border-gray-800
    hover:shadow-blue-600/50"
    >
      <button
        type="button"
        onClick={onToggleFavorite}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 border border-gray-700 hover:border-rose-400"
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`w-5 h-5 transition ${favorite ? "fill-rose-500 text-rose-500" : "text-gray-200"}`}
        />
      </button>
      <Link to={`/recipe/${recipeId}/`}>
        <div
          className="absolute inset-0 rounded-xl border-2 border-transparent
    group-hover:border-blue-500/80 transition duration-500"
        />
        <div className="flex justify-center items-center p-5">
          <img
            src={image}
            alt={title}
            className="h-60 w-60 rounded-xl border border-yellow-400 transition duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-2 text-center">
          <h3
            className="text-xl pb-3 font-bold text-gray-100 mb-1 group-hover:text-blue-400
        transition duration-300"
          >
            {title}
          </h3>
        </div>
      </Link>
    </div>
  );
};

export default ReceipeCard;
