import React from "react";
import Slider from "react-slick";
import { Clock } from "lucide-react";

import { useFetch } from "./useFetch";
import ReceipeCard from "./ReceipeCard";

const ReceipeSlider = ({ title, fetchUrl }) => {

  const { data, loading, error } = useFetch(fetchUrl);

  const meals = data?.meals || [];

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 600,
    autoplaySpeed: 2000,
    cssEase: "linear",

    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Something went wrong!</p>;
  }

  return (
    <section className="mt-6 mx-auto">

      <h2 className="text-3xl font-extrabold text-gray-100 mb-6 tracking-tight border-l-4 border-yellow-400 pl-4 flex items-center">
        <Clock className="w-6 h-6 mr-3 text-blue-500" />
        {title}
      </h2>

      <div className="w-[90%] mx-auto p-3">

        <Slider {...settings}>
          {meals.map((meal) => (
            <div key={meal.idMeal} className="px-6 flex justify-center">
              <ReceipeCard meal={meal} />
            </div>
          ))}
        </Slider>

      </div>
    </section>
  );
};

export default ReceipeSlider;
