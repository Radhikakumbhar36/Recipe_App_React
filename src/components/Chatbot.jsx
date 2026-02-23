import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Loader, Send, Bot, User } from "lucide-react";
import ReceipeCard from "./ReceipeCard";
import { searchRecipesByIngredients } from "../services/recipeService";

const parseIngredients = (value) => {
  return [...new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  )];
};

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Tell me ingredients you have, separated by commas. Example: egg, tomato, onion",
    },
  ]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [activeIngredients, setActiveIngredients] = useState([]);

  const hasNextPage = recipes.length === 12;

  const runIngredientSearch = async (ingredients, pageNumber) => {
    try {
      setLoading(true);
      setError("");
      const result = await searchRecipesByIngredients(ingredients, pageNumber);
      setRecipes(result);

      if (pageNumber === 1) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "bot",
            text: result.length
              ? `I found ${result.length} recipes for: ${ingredients.join(", ")}`
              : `No recipes matched all these ingredients: ${ingredients.join(", ")}`,
          },
        ]);
      }
    } catch (err) {
      setError(err.message || "Unable to search recipes.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const parsedIngredients = parseIngredients(input);
    if (parsedIngredients.length === 0) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "user",
        text: parsedIngredients.join(", "),
      },
    ]);
    setInput("");
    setPage(1);
    setActiveIngredients(parsedIngredients);
    await runIngredientSearch(parsedIngredients, 1);
  };

  const onPrevious = async () => {
    if (page === 1 || loading) return;
    const nextPage = page - 1;
    setPage(nextPage);
    await runIngredientSearch(activeIngredients, nextPage);
  };

  const onNext = async () => {
    if (!hasNextPage || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await runIngredientSearch(activeIngredients, nextPage);
  };

  return (
    <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link
        to="/"
        className="text-yellow-400 hover:text-yellow-300 flex items-center mb-4 sm:mb-6 font-medium transition text-base sm:text-lg group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-1 transition" />
        Back to Dashboard
      </Link>

      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-100 mb-4">Ingredient Assistant</h1>

        <div className="space-y-3 max-h-72 overflow-y-auto mb-4 pr-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "bot" && <Bot className="w-5 h-5 mt-1 text-blue-400" />}
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm sm:text-base ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-200 border border-gray-700"
                }`}
              >
                {message.text}
              </div>
              {message.role === "user" && <User className="w-5 h-5 mt-1 text-yellow-400" />}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type ingredients: egg, onion, rice"
            className="flex-1 px-4 py-2 border border-gray-700 bg-gray-950 text-gray-50 rounded-xl text-sm sm:text-base"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition"
          >
            <Send className="w-4 h-4" />
            Ask
          </button>
        </form>
      </section>

      {loading && (
        <div className="text-center p-6 text-gray-300">
          <Loader className="animate-spin inline-block mr-2 text-blue-400" />
          Finding recipes...
        </div>
      )}

      {!loading && error && <p className="text-red-400 text-center py-6">{error}</p>}

      {!loading && recipes.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8 lg:gap-12">
            {recipes.map((recipe) => (
              <ReceipeCard key={recipe.id} meal={recipe} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10">
            <button
              type="button"
              onClick={onPrevious}
              disabled={page === 1 || loading}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="text-gray-300">Page {page}</span>
            <button
              type="button"
              onClick={onNext}
              disabled={!hasNextPage || loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default Chatbot;
