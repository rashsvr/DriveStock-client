import React from "react";

const OrderHistoryCard = () => {
  // Dummy data with purchase date added
  const dummyOrder = {
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
    purchaseDate: "March 15, 2025", // New field
  };

  return (
    <div className="card bg-base-100 w-full max-w-xs shadow-md hover:shadow-lg transition-shadow duration-300 mx-auto">
      {/* Image */}
      <figure className="h-32 w-full">
        <img
          src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          alt={dummyOrder.name}
          className="object-cover w-full h-full"
        />
      </figure>

      {/* Card Body */}
      <div className="card-body p-4">
        {/* Title and Badge */}
        <div className="flex items-start gap-2">
          <h2 className="card-title text-base font-semibold truncate flex-1">
            {dummyOrder.name}
          </h2>
          {dummyOrder.condition === "New" && (
            <div className="badge badge-secondary badge-sm flex-shrink-0">NEW</div>
          )}
        </div>

        {/* Essential Details */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-medium">{dummyOrder.make.join(", ")}</span>
          </p>
          <p>
            <span className="font-medium">Purchase Date: </span>
            {dummyOrder.purchaseDate}
          </p>
          <p>
            <span className="font-semibold text-lg">Price: ${dummyOrder.price}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="card-actions justify-end mt-4 flex-wrap gap-2">
          <label htmlFor="orderhistoryview" className="btn btn-xs">
            View More..
          </label>
        </div>
      </div>

      {/* Modal */}
      <input type="checkbox" id="orderhistoryview" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold mb-4">{dummyOrder.name}</h3>
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Code: </span>
              {dummyOrder.code}
            </p>
            <p>
              <span className="font-medium">Category: </span>
              {dummyOrder.category}
            </p>
            <p>
              <span className="font-medium">Subcategory: </span>
              {dummyOrder.subCategory}
            </p>
            <p>
              <span className="font-medium">Make: </span>
              {dummyOrder.make.join(", ")}
            </p>
            <p>
              <span className="font-medium">Model: </span>
              {dummyOrder.model.join(", ")}
            </p>
            <p>
              <span className="font-medium">Year: </span>
              {dummyOrder.year.join(", ")}
            </p>
            <p>
              <span className="font-medium">Condition: </span>
              {dummyOrder.condition}
            </p>
            <p>
              <span className="font-medium">Brand: </span>
              {dummyOrder.brand}
            </p>
            <p>
              <span className="font-medium">OEM/Aftermarket: </span>
              {dummyOrder.oemAftermarket}
            </p>
            <p>
              <span className="font-medium">Availability: </span>
              <span
                className={
                  dummyOrder.availability === "In Stock"
                    ? "text-green-500"
                    : "text-yellow-500"
                }
              >
                {dummyOrder.availability}
              </span>
            </p>
            <p>
              <span className="font-medium">Material: </span>
              {dummyOrder.material}
            </p>
            <p>
              <span className="font-medium">Seller Location: </span>
              {dummyOrder.sellerLocation}
            </p>
            <p>
              <span className="font-medium">Purchase Date: </span>
              {dummyOrder.purchaseDate}
            </p>
            <p>
              <span className="font-medium text-lg">Price: ${dummyOrder.price}</span>
            </p>
          </div>
        </div>
        <label className="modal-backdrop" htmlFor="orderhistoryview">
          Close
        </label>
      </div>
    </div>
  );
};

export default OrderHistoryCard;