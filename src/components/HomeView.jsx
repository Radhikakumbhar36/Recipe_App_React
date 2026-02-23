import React, { useEffect, useState } from "react";
import ReceipeSlider from "./ReceipeSlider";
import TredingReceipe from "./TredingReceipe";
import CategorySelection from "./CategorySelection";
import { searchRecipes } from "../services/recipeService";

const HomeView = () => {
  const [curatedRecipes, setCuratedRecipes] = useState([]);
  const [quickRecipes, setQuickRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeSections = async () => {
      try {
        setLoading(true);
        setError("");

        const [curated, quick] = await Promise.all([
          searchRecipes("chicken", {}, 1),
          searchRecipes("", { cuisine: "Canadian" }, 1),
        ]);

        setCuratedRecipes(curated || []);
        setQuickRecipes(quick || []);
      } catch (err) {
        setError(err.message || "Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeSections();
  }, []);

  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ReceipeSlider
        title="Staff Curated Picks"
        recipes={curatedRecipes}
        loading={loading}
        error={error}
      />
      <TredingReceipe
        title="Quick & Easy Meals"
        recipes={quickRecipes}
        loading={loading}
        error={error}
      />
      <CategorySelection />
    </main>
  );
};

export default HomeView;
