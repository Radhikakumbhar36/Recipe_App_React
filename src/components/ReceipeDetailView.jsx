import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader, ChevronLeft, Utensils, BookOpen } from "lucide-react";
import { getRecipeDetails } from "../services/recipeService";

const ReceipeDetailView = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getRecipeDetails(id);
        setRecipe(data);
      } catch (err) {
        setError(err.message || "Failed to load recipe details.");
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  const ingredients = useMemo(() => {
    return recipe?.extendedIngredients?.map((item) => ({
      ingredient: item.nameClean || item.name,
      measure: item.originalMeasure || item.amount,
    })) || [];
  }, [recipe]);

  const instructions = useMemo(() => {
    const stepList = recipe?.analyzedInstructions?.[0]?.steps?.map((step) => step.step) || [];

    if (stepList.length > 0) return stepList;

    const raw = (recipe?.instructions || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return raw
      ? raw
          .split(".")
          .map((step) => step.trim())
          .filter(Boolean)
      : [];
  }, [recipe]);

  if (loading)
    return (
      <div className="text-center p-8 text-gray-300">
        <Loader className="animate-spin inline-block mr-2 text-blue-400" />
        Preparing your recipe card...
      </div>
    );

  if (error) {
    return <p className="text-center text-red-400 py-8">{error}</p>;
  }

  if (!recipe) {
    return <p className="text-center text-gray-400 py-8">Recipe not found.</p>;
  }

  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="text-yellow-400 hover:text-yellow-300 flex items-center mb-6 font-medium transition text-lg group"
      >
        <ChevronLeft className="w-6 h-6 mr-1 transition" />
        Back to Dashboard
      </Link>

      <div className="bg-gray-900 p-6 md:p-12 rounded-3xl shadow-2xl shadow-black/70 border border-gray-800">
        <div className="lg:flex lg:space-x-12">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl font-black text-gray-100 mb-6 leading-tight">{recipe.title}</h1>

            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-[400px] h-[400px] rounded-xl shadow-2xl shadow-black/50 object-cover border-4 border-gray-800 ring-2 ring-blue-500/50 mx-5"
            />
          </div>

          <div className="lg:w-1/2 bg-gray-800 rounded-xl shadow-inner shadow-black/30 border border-gray-700 pb-3">
            <h2 className="text-3xl font-bold text-yellow-400 mb-6 flex items-center border-b border-gray-700 pb-3 p-3">
              <Utensils className="w-7 h-7 mr-3 text-blue-500" />
              Key Ingredients
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 list-none p-0">
              {ingredients.map((item, index) => (
                <li key={index} className="flex items-start text-gray-300 text-base ml-2">
                  <span className="text-blue-400 font-extrabold text-lg mr-2 shrink-0">&gt;</span>
                  <span className="font-semibold text-white mr-1">{item.measure}</span> {item.ingredient}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t border-gray-700">
              <div className="text-lg text-gray-400 space-x-3 flex flex-wrap gap-y-2">
                {(recipe.dishTypes || []).slice(0, 2).map((dish, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-600 text-white ml-3 px-4 py-1.5 rounded-full font-semibold text-sm shadow-md"
                  >
                    {dish}
                  </span>
                ))}
                {recipe.cuisines?.[0] && (
                  <span className="bg-green-600 text-white ml-3 px-4 py-1.5 rounded-full font-semibold text-sm shadow-md">
                    {recipe.cuisines[0]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800">
          <h2 className="text-3xl font-bold text-gray-100 mb-8 flex items-center">
            <BookOpen className="w-7 h-7 mr-3 text-blue-500" /> Detailed Preparation Steps
          </h2>
          <ol className="space-y-6 list-none text-gray-300">
            {instructions.map((step, index) => (
              <li
                key={index}
                className="text-lg leading-relaxed bg-gray-800 p-5 rounded-xl border-1-6 border-blue-500 shadow-lg shadow-black-30 transition duration-300 hover:bg-gray-700/50"
              >
                <span className="font-extrabold text-yellow-400 mr-3 text-xl">{index + 1}</span>
                {step.trim()}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
};

export default ReceipeDetailView;
