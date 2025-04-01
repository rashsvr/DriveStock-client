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
        <div >
            {isProcessing && <LoadingAnimation />}

            <div className="grid grid-cols-12 grid-rows-9 gap-0">
                <div className="col-span-2 col-start-2 row-start-2"><Title text={title} /></div>
                <div className="col-span-4 col-start-8 row-start-2"><SearchBar /></div>
                <div className="col-span-5 col-start-2 row-start-3"><Breadcrumbs /></div>
                <div className="col-span-6 col-start-2 row-start-4"><FilterChips/></div>
                <div className="col-span-10 col-start-2 row-start-5"><FilterChips/></div>
                <div className="col-span-8 row-span-6 col-start-3 row-start-6">
                    <ProductCard />

            {children}
                </div>
                <div className="col-span-8 col-start-3 row-start-12 text-center underline text-orange-500">
                    <h1>Load more</h1>
                </div>
    
            </div>

        </div>
    );
};

export default SubLayout;