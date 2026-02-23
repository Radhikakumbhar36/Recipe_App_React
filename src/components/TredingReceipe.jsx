import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { Clock, Loader } from "lucide-react";

const TredingReceipe = ({ title, recipes = [], loading = false, error = "" }) => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    appendDots: () => null,
    customPaging: () => null,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (loading)
    return (
      <div className="text-center p-8 text-gray-300">
        <Loader className="animate-spin inline-block mr-2 text-blue-400" />
        Loading {title}...
      </div>
    );

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <section className="mt-2 mx-auto">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-100 mb-4 sm:mb-6 tracking-tight border-l-4 border-yellow-400 pl-3 sm:pl-4 flex items-center">
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-500" />
        {title}
      </h2>

      <div className="w-full mx-auto">
        <Slider {...settings}>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="px-2 sm:px-6 md:px-8 lg:px-10 flex justify-center">
              <Link to={`/recipe/${recipe.id}/`}>
                <div className="relative bg-gray-900 rounded-xl shadow-xl shadow-black/50 overflow-hidden group transform transition duration-500 cursor-pointer border border-gray-800 hover:shadow-blue-600/50 mb-5">
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-500/80 transition duration-500"></div>

                  <div className="flex justify-center items-center p-5">
                    <img
                      src={recipe?.image}
                      alt={recipe?.title || "recipe"}
                      className="h-[120px] w-[120px] rounded-xl border border-yellow-400 transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default TredingReceipe;
