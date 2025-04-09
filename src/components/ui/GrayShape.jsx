import React, { useState, useEffect } from "react";

const GrayShape = ({ logos }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Simpler loading state - starts animation after short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500); // Short delay to ensure DOM is ready
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="absolute left-0 overflow-hidden
        xl:bottom-10 xl:w-[500px]  
        lg:bottom-10 lg:w-[400px]  
        md:bottom-0 md:w-[350px] 
        sm:top-0 sm:w-[300px]  
        top-0 w-[250px] h-[99px]
        bg-highlight-orange rounded-tr-[48px]"
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 48px) 0, 100% 48px, 100% calc(100% - 48px), calc(100% - 48px) 100%, 0 100%)",
        boxShadow: "inset 6px 6px 128px rgba(0, 0, 0, 0.5), inset -6px -6px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        className="carousel carousel-center p-4 overflow-visible"
        style={{
          display: "flex",
          width: "fit-content",
          animation: isLoaded ? "scroll 20s linear infinite" : "none",
        }}
      >
        {/* Quadruple the logos for smoother looping */}
        {[...logos, ...logos, ...logos, ...logos].map((logo, index) => (
          <div key={`${logo}-${index}`} className="carousel-item">
            <img
              src={logo}
              alt={`Logo ${index % logos.length}`}
              className="object-contain rounded-box
                xl:max-w-[100px] xl:max-h-[100px]
                lg:max-w-[100px] lg:max-h-[100px]
                md:max-w-[90px] md:max-h-[90px]
                sm:max-w-[80px] sm:max-h-[80px]
                max-w-[90px] max-h-[90px]"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// CSS for auto-scrolling
const styles = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(calc(-100% / 2));
    }
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default React.memo(GrayShape);