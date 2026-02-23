import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader, ChevronLeft } from "lucide-react";
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

  const summaryText = useMemo(() => {
    return (recipe?.summary || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }, [recipe]);

  const instructionsText = useMemo(() => {
    const stepList = recipe?.analyzedInstructions?.[0]?.steps?.map((step) => step.step) || [];
    if (stepList.length > 0) return stepList.join(" ");

    return (recipe?.instructions || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, [recipe]);

  const calories = useMemo(() => {
    const calorieNutrient = recipe?.nutrition?.nutrients?.find(
      (nutrient) => nutrient?.name?.toLowerCase() === "calories"
    );

    if (!calorieNutrient) return "N/A";
    return `${calorieNutrient.amount} ${calorieNutrient.unit}`;
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

      <div className="bg-gray-900 p-6 md:p-12 rounded-3xl shadow-2xl shadow-black/70 border border-gray-800 space-y-8">
        <h1 className="text-4xl font-black text-gray-100 leading-tight">{recipe.title}</h1>

        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full max-w-3xl h-auto rounded-xl shadow-2xl shadow-black/50 object-cover border-2 border-gray-800"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Ready In</p>
            <p className="text-xl font-semibold text-white">{recipe.readyInMinutes ?? "N/A"} min</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Servings</p>
            <p className="text-xl font-semibold text-white">{recipe.servings ?? "N/A"}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Calories</p>
            <p className="text-xl font-semibold text-white">{calories}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">Summary</h2>
          <p className="text-gray-300 leading-relaxed">{summaryText || "No summary available."}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">Instructions</h2>
          <p className="text-gray-300 leading-relaxed">{instructionsText || "No instructions available."}</p>
        </div>
      </div>
    </main>
  );
};

export default ReceipeDetailView;
