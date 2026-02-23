import { Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const CategorySelection = () => {
  const featuredCategories = [
    "Chicken",
    "Dessert",
    "Seafood",
    "Vegetarian",
    "Breakfast",
    "Pasta",
    "Goat",
    "Pork",
    "Lamb",
  ];

  return (
    <section className="mt-12 sm:mt-20">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mb-4 sm:mb-6 tracking-tight border-l-4 border-yellow-400 pl-3 sm:pl-4 flex items-center">
        <Utensils className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-500" />
        Quick Filter by Primary Ingredient
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
        {featuredCategories.map((cat, index) => (
          <Link
            to={`/search/${encodeURIComponent(cat)}?type=category`}
            key={index}
            className="bg-gray-800 px-3 py-3 sm:p-5 rounded-xl shadow-xl shadow-black/50 transition duration-300 text-center text-sm sm:text-base font-semibold text-gray-100 border border-gray-700 hover:border-blue-500 hover:text-blue-400 transform hover:scale-[1.05] hover:bg-gray-700/50 mt-2"
          >
            {cat}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySelection;
