import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../Utils/axiosInstance";

const FeaturedProducts = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const parseQuantity = (quantity) => {
    if (typeof quantity === "number") return quantity;
    if (!quantity) return 0;
    const match = String(quantity).match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : 0;
  };

  useEffect(() => {
    let mounted = true;

    const loadFeatured = async () => {
      try {
        setLoading(true);
        
        const res = await api.get("/foods", { 
          params: { status: "available", limit: 10 }
        });
        
        const data = res.data?.foods || res.data || [];

        const sortedFoods = [...data]
          .sort((a, b) => parseQuantity(b.food_quantity) - parseQuantity(a.food_quantity))
          .slice(0, 6);

        if (mounted) setFoods(sortedFoods);
      } catch (err) {
        console.error("Featured foods load error:", err?.response?.data || err.message);
        if (mounted) setFoods([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadFeatured();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="my-16 px-6 md:px-10 text-center">
        <div className="loading loading-spinner loading-lg text-orange-500"></div>
        <p className="text-gray-500 mt-2">Loading featured foods...</p>
      </section>
    );
  }

  if (!foods.length) {
    return (
      <section className="my-16 px-6 md:px-10 text-center">
        <p className="text-gray-500">No featured foods available at the moment.</p>
      </section>
    );
  }

  return (
    <section className="my-16 px-6 md:px-10 max-w-7xl mx-auto">
      <div className="text-center mb-4">
        <span className="px-4 py-1 bg-orange-100 text-orange-500 rounded-full text-sm font-medium">
          🍛 Featured Foods
        </span>
      </div>

      <h2 className="text-3xl font-bold text-center mb-3">
        Discover our <span className="text-orange-500">Handpicked</span> meals ready
      </h2>

      <p className="text-center text-gray-500 max-w-xl mx-auto mb-14">
        Highlighting the best meals available right now.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => {
          const donatorName = food?.donator?.name || food?.donator_name || "Anonymous Donator";
          
          return (
            <div
              key={food._id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <figure className="relative overflow-hidden h-56">
                <img
                  src={food.food_image || food.image || "/api/placeholder/400/300"}
                  alt={food.food_name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/400/300";
                  }}
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title text-xl font-bold">{food.food_name}</h2>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    👤 {donatorName}
                  </p>
                  <p className="text-sm font-semibold text-orange-600">
                    📦 {food.food_quantity}
                  </p>
                </div>

                <p className="text-gray-600 text-sm flex items-center gap-1">
                  📍 {food.pickup_location || "Location not specified"}
                </p>

                {food.expiry_date && (
                  <p className="text-xs text-red-500">
                    ⏰ Expires: {new Date(food.expiry_date).toLocaleDateString()}
                  </p>
                )}

                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/food/${food._id}`}
                    className="btn bg-orange-500 hover:bg-orange-600 text-white border-none"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link to="/availableFoods" className="btn btn-outline btn-primary px-8">
          Browse All Foods
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;