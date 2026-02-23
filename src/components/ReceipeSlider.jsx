import React from "react";
import Slider from "react-slick";
import { Clock } from "lucide-react";
import ReceipeCard from "./ReceipeCard";

const ReceipeSlider = ({ title, recipes = [], loading = false, error = "" }) => {
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
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
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
          {recipes.map((recipe) => (
            <div key={recipe.id} className="px-6 flex justify-center">
              <ReceipeCard meal={recipe} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ReceipeSlider;
