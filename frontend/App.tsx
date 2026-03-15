/// <reference types="vite/client" />
import { useState } from "react";
import { IoRestaurant, IoRefresh } from "react-icons/io5";
import Lottie from "lottie-react";
import loadingAnimation from "./assets/loading.json";
import foodBowlAnimation from "./assets/food-bowl.json";
import dogAnimation from "./assets/dog.json";
// import dotenv from "dotenv";

// dotenv.config();

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

interface MealType {
  title: string;
  description: string;
}

function App() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

  const [meals, setMeals] = useState<MealType[] | undefined>([]);
  const [loading, setLoading] = useState(false);

  const getRandomMeals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/meals`);
      const data = await res.json();
      setMeals(data);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const storedMeals = [
    {
      title: "Spaghetti Carbonara",
      description:
        "Classic Italian pasta with creamy egg sauce, crispy pancetta, and Parmesan cheese",
    },
    {
      title: "Chicken Tikka Masala",
      description:
        "Tender chicken in a rich, creamy tomato-based curry with aromatic spices",
    },
    {
      title: "Beef Tacos",
      description:
        "Seasoned ground beef in soft tortillas with fresh salsa, cheese, and crispy lettuce",
    },
    {
      title: "Pad Thai",
      description:
        "Sweet and savory Thai stir-fried noodles with shrimp, peanuts, and bean sprouts",
    },
  ];

  const MealCard = ({ meal }: { meal: MealType }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-blue-100 hover:border-blue-300 transform hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="shrink-0 bg-blue-100 p-3 rounded-lg">
            <IoRestaurant className="text-xl text-blue-600 icon-spin-hover" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{meal.title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 leading-relaxed">
          {meal.description}
        </CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-blue-100 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3 mt-4">
            Meal Inspiration
          </h1>
          <Lottie
            animationData={dogAnimation}
            loop={true}
            className="w-32 h-32 mx-auto"
          />
          <p className="text-gray-600 text-lg">
            Discover delicious meals to try today
          </p>
        </div>

        <div className="text-center mb-2">
          <button
            onClick={getRandomMeals}
            disabled={loading}
            className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 flex items-center gap-2 mx-auto hover:cursor-pointer"
          >
            {loading ? (
              <>
                <Lottie
                  animationData={loadingAnimation}
                  loop={true}
                  className="w-6 h-6"
                />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <IoRefresh className="text-xl" />
                <span>Get Random Meals</span>
              </>
            )}
          </button>
        </div>

        {meals != undefined && meals?.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 mt-8">
            {meals.map((meal, index) => (
              <MealCard key={index} meal={meal} />
            ))}
          </div>
        )}

        {meals != undefined && meals.length === 0 && !loading && (
          <div className="text-center py-4">
            <Lottie
              animationData={foodBowlAnimation}
              loop={true}
              className="w-64 h-64 mx-auto mb-4"
            />
          </div>
        )}

        {meals == undefined && (
          <>
            <p className="mt-10 text-gray-600 text-center">
              Unfortunately we could not fetch random meals from the API.
            </p>
            <p className="text-gray-600 text-center mb-8">
              Below are some meals chosen by us. This could be due to{" "}
              <p className="font-semibold">rate limits</p>
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {storedMeals.map((meal, index) => (
                <MealCard key={index} meal={meal} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
