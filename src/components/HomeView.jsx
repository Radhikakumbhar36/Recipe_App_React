import React from "react";

import ReceipeSlider from "./ReceipeSlider";
import TredingReceipe from "./TredingReceipe";
import CategorySelection from "./CategorySelection";

import { API_URL } from "./useFetch";

const HomeView = ({filterByCategory}) => {
  return (
    <>
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ReceipeSlider
          title="Staff Curated Picks"
          fetchUrl={`${API_URL}search.php?f=c`}
        />
        <TredingReceipe
          title="Quick & Easy Meals"
          fetchUrl={`${API_URL}filter.php?a=Canadian`}
        />
        <CategorySelection  filterByCategory={filterByCategory}/>
      </main>
    </>
  );
};

export default HomeView;
