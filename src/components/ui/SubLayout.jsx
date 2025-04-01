import React, { useState } from "react";
import Title from "../Title";
import LoadingAnimation from "../function/loadingAnimation";
import SearchBar from "./SearchBar";
import ProductCard from "./ProductCard";
import Breadcrumbs from "./Breadcrumbs";
import FilterChips from "./FilterChips";

const SubLayout = ({ title, children }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleProcess = async () => {
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsProcessing(false);
    };

    return (
        <div className="relative min-h-screen">
            {isProcessing && <LoadingAnimation />}

            <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 lg:px-0">
                {/* Title */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-2 lg:col-start-2 lg:row-start-2">
                    <Title text={title} />
                </div>

                {/* SearchBar */}
                <div className="col-span-12 sm:col-span-6 lg:col-span-4 lg:col-start-8 lg:row-start-2">
                    <SearchBar />
                </div>

                {/* Breadcrumbs */}
                <div className="col-span-12 lg:col-span-5 lg:col-start-2 lg:row-start-3">
                    <Breadcrumbs />
                </div>

                {/* FilterChips (Top) */}
                <div className="col-span-12 lg:col-span-6 lg:col-start-2 lg:row-start-4">
                    <FilterChips />
                </div>

                {/* FilterChips (Secondary) */}
                <div className="col-span-12 lg:col-span-10 lg:col-start-2 lg:row-start-5">
                    <FilterChips />
                </div>

                {/* ProductCard and Children */}
                <div className="col-span-12 lg:col-span-8 lg:row-span-6 lg:col-start-3 lg:row-start-6">
                    <ProductCard />
                    {children}
                </div>

                {/* Load More */}
                <div className="col-span-12 lg:col-span-8 lg:col-start-3 lg:row-start-12 text-center underline text-orange-500">
                    <h1>Load more</h1>
                </div>
            </div>
        </div>
    );
};

export default SubLayout;