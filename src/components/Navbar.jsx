import React, { useState } from "react";
import { Search, Zap, Heart, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const term = input.trim();
    if (!term) return;

    navigate(`/search/${encodeURIComponent(term)}`);
    setInput("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md shadow-2xl shadow-black/50 border-b border-blue-900/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          <Link
            to="/"
            className="flex items-center text-xl sm:text-2xl font-black text-white hover:text-blue-400 transition duration-300 tracking-widest"
          >
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 mr-2 text-yellow-400" />
            <span className="text-blue-400">Pro</span>Chef
          </Link>

          <form onSubmit={onSubmit} className="flex-1 max-w-lg mx-4 hidden sm:flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for recipes..."
              className="w-full px-5 py-2 border border-gray-700 bg-gray-900 text-gray-50 rounded-l-full"
            />
            <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-r-full">
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Link
              to="/assistant"
              className="inline-flex items-center gap-1 sm:gap-2 text-gray-100 border border-gray-700 rounded-full px-3 sm:px-4 py-2 hover:bg-gray-800 hover:border-blue-500 transition text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Assistant</span>
            </Link>
            <Link
              to="/favorites"
              className="inline-flex items-center gap-1 sm:gap-2 text-gray-100 border border-gray-700 rounded-full px-3 sm:px-4 py-2 hover:bg-gray-800 hover:border-rose-500 transition text-sm sm:text-base"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Favorites</span>
            </Link>
          </div>
        </div>

        <form onSubmit={onSubmit} className="pb-3 sm:hidden flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search recipes..."
            className="w-full px-4 py-2 border border-gray-700 bg-gray-900 text-gray-50 rounded-l-full text-sm"
          />
          <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-r-full">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
