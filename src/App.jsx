import React from "react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import CuisineBar from "./components/Cuisine";
import ReceipeDetailView from "./components/ReceipeDetailView";
import SearchView from "./components/SearchView";
import Favorites from "./components/Favorites";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 font-sans text-gray-100">
        <Navbar />
        <CuisineBar />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/recipe/:id" element={<ReceipeDetailView />} />
          <Route path="/search/:query" element={<SearchView />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
