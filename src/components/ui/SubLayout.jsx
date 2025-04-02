// components/ui/SubLayout.jsx
import React from "react";
import Title from "../Title";
import Breadcrumbs from "../ui/Breadcrumbs";

const SubLayout = ({
  title,
  children,
  showSearch = false,
  showFilters = false,
  showSecondaryFilters = false,
  showLoadMore = false,
  onLoadMore,
  isLoading = false,
  SearchComponent,
  FilterComponent,
  SecondaryFilterComponent,
}) => {
  return (
    <div className="relative min-h-screen">
      <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 lg:px-0">
        {/* Fixed Title Position */}
        <div className="col-span-12 sm:col-span-6 lg:col-span-2 lg:col-start-2 lg:row-start-2">
          <Title text={title} />
        </div>

        {/* Fixed Breadcrumbs Position */}
        <div className="col-span-12 lg:col-span-12 lg:col-start-2 lg:row-start-3">
          <Breadcrumbs title={title} />
        </div>

        {/* Optional Search Component */}
        {showSearch && SearchComponent && (
          <div className="col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-8 lg:row-start-2">
            <SearchComponent />
          </div>
        )}

        {/* Optional Primary Filters */}
        {showFilters && FilterComponent && (
          <div className="col-span-12 lg:col-span-6 lg:col-start-2 lg:row-start-4">
            <FilterComponent />
          </div>
        )}

        {/* Optional Secondary Filters */}
        {showSecondaryFilters && SecondaryFilterComponent && (
          <div className="col-span-12 lg:col-span-10 lg:col-start-2 lg:row-start-5">
            <SecondaryFilterComponent />
          </div>
        )}

        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8 lg:row-span-6 lg:col-start-3 lg:row-start-6">
          {children}
        </div>

        {/* Optional Load More Button */}
        {showLoadMore && (
          <div className="col-span-12 lg:col-span-8 lg:col-start-3 lg:row-start-12 text-center">
            <button
              className="btn text-orange-500 underline"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading && (
                <span className="loading loading-spinner text-orange-500"></span>
              )}
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubLayout;