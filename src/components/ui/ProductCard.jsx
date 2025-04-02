import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = () => {
    const navigate = useNavigate();
  // Dummy data
  const dummyProduct = {
    id: 1,
    name: "Toyota Corolla Brake Pads",
    category: "Braking System",
    subCategory: "Brake Pads & Discs",
    make: ["Toyota"],
    model: ["Corolla"],
    year: [2015, 2018, 2020],
    condition: "New",
    price: 80,
    brand: "Bosch",
    oemAftermarket: "OEM",
    availability: "In Stock",
    material: "Metal",
    sellerLocation: "New York",
    code: "BP-TC2018",
  };

  return (
    <div className="card bg-base-100 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto">
      {/* Image */}
      <figure className="h-32 w-full">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt={dummyProduct.name}
          className="object-cover w-full h-full"
        />
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        {/* Title and Badge */}
        <div className="flex items-start gap-2">
          <h2 className="card-title text-base font-semibold truncate flex-1">
            {dummyProduct.name}
          </h2>
          {dummyProduct.condition === "New" && (
            <div className="badge badge-secondary badge-sm flex-shrink-0">NEW</div>
          )}
        </div>

        {/* Essential Details */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">{dummyProduct.make.join(", ")}</span>
          </p>
          <p>
            <span className="font-medium">Availability: </span>
            <span
              className={
                dummyProduct.availability === "In Stock"
                  ? "text-green-500"
                  : "text-yellow-500"
              }
            >
              {dummyProduct.availability}
            </span>
          </p>
          <p>
            <span className="font-semibold text-lg">Price: ${dummyProduct.price}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="card-actions justify-between mt-4 flex-wrap gap-2">
          <button className="btn btn-primary btn-xs"     onClick={() => navigate("/checkout")}>Buy Now</button>
          <label htmlFor="singleproductview" className="btn btn-xs">
            View More..
          </label>
        </div>
      </div>

      {/* Modal */}
      <input type="checkbox" id="singleproductview" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold mb-4">{dummyProduct.name}</h3>
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Code: </span>
              {dummyProduct.code}
            </p>
            <p>
              <span className="font-medium">Category: </span>
              {dummyProduct.category}
            </p>
            <p>
              <span className="font-medium">Subcategory: </span>
              {dummyProduct.subCategory}
            </p>
            <p>
              <span className="font-medium">Make: </span>
              {dummyProduct.make.join(", ")}
            </p>
            <p>
              <span className="font-medium">Model: </span>
              {dummyProduct.model.join(", ")}
            </p>
            <p>
              <span className="font-medium">Year: </span>
              {dummyProduct.year.join(", ")}
            </p>
            <p>
              <span className="font-medium">Condition: </span>
              {dummyProduct.condition}
            </p>
            <p>
              <span className="font-medium">Brand: </span>
              {dummyProduct.brand}
            </p>
            <p>
              <span className="font-medium">OEM/Aftermarket: </span>
              {dummyProduct.oemAftermarket}
            </p>
            <p>
              <span className="font-medium">Availability: </span>
              <span
                className={
                  dummyProduct.availability === "In Stock"
                    ? "text-green-500"
                    : "text-yellow-500"
                }
              >
                {dummyProduct.availability}
              </span>
            </p>
            <p>
              <span className="font-medium">Material: </span>
              {dummyProduct.material}
            </p>
            <p>
              <span className="font-medium">Seller Location: </span>
              {dummyProduct.sellerLocation}
            </p>
            <p>
              <span className="font-medium text-lg bg-orange-500 p-3 rounded">Price: ${dummyProduct.price}</span>
            </p>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="singleproductview">
          Close
        </label>
      </div>
    </div>
  );
};

export default ProductCard;