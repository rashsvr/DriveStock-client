import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Rive, { useRive } from "@rive-app/react-canvas";
import ProfileAnimation from "../animations/profile.riv";  
import LoadingAnimation from "../components/function/loadingAnimation";
import GrayShape from "../components/ui/GrayShape";
import MainCarousel from "../components/ui/MainCarousel";
import ProfileContent from "../components/ui/ProfileContent";
import api from "../services/api";  

const logos = [
  "https://www.carlogos.org/logo/Peugeot-logo-2010-1920x1080.png",
  "https://www.carlogos.org/car-logos/hyundai-logo-2011-download.png",
  "https://www.carlogos.org/car-logos/porsche-logo-2014-full-download.png",
  "https://www.carlogos.org/logo/McLaren-logo-2002-2560x1440.png",
  "https://www.carlogos.org/logo/Mercedes-Benz-logo-2011-1920x1080.png",
  "https://www.carlogos.org/logo/Bugatti-logo-1024x768.png",
  "https://www.carlogos.org/car-logos/jeep-logo-1993-download.png",
];

const main = [
  "https://wallpaperaccess.com/full/13643.jpg",
  "https://wallpaperaccess.com/full/13644.jpg",
  "https://wallpaperaccess.com/full/13647.jpg",
  "https://wallpaperaccess.com/full/13648.jpg",
  "https://wallpaperaccess.com/full/13648.jpg",
  "https://wallpaperaccess.com/full/13651.jpg",
];

const HomePage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [riveError, setRiveError] = useState(null); // Track Rive loading errors
  const navigate = useNavigate();

  // Rive animation setup with state machine inputs
  const riveParams = {
    src: ProfileAnimation,
    stateMachines: "State Machine 1", // Adjust to your .riv file's state machine name
    autoplay: true,
  };
  const { rive, RiveComponent } = useRive(riveParams, {
    onError: (error) => {
      console.error("Rive animation failed to load:", error);
      setRiveError("Failed to load profile animation.");
    },
  });

  useEffect(() => {
    setIsAuthenticated(api.isAuthenticated());
  }, []);

  const handleSignIn = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate("/login");
      setIsProcessing(false);
    }, 1000);
  };

  const handleProfileClick = () => {
    if (rive) {
      rive.play("Pressed"); // Trigger Pressed state on click
    }
    document.getElementById("profile_modal").showModal();
  };

  const handleMouseEnter = () => {
    if (rive) {
      rive.play("Hover"); // Trigger Hover state on mouse enter
    }
  };

  const handleMouseLeave = () => {
    if (rive) {
      rive.play("Idle"); // Return to Idle state on mouse leave
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <MainCarousel images={main} className="w-full h-full object-cover" />
      </div>

      {/* Overlay UI */}
      <div className="relative z-10">
        {isProcessing && <LoadingAnimation />}
        <GrayShape logos={logos} className="z-0" />

        {/* Responsive Profile/Sign In Section */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 lg:top-8 lg:right-8">
          {isAuthenticated ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleProfileClick}
              className="cursor-pointer w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center"
            >
              {riveError ? (
                <span className="text-red-500 text-xs sm:text-sm">{riveError}</span>
              ) : (
                <RiveComponent className="w-full h-full scale-90  " />
              )}
            </motion.div>
          ) : (
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(249, 115, 22, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2 md:text-base lg:px-8 lg:py-3 lg:text-lg bg-gradient-to-r from-base-100 to-base-300 text-highlight-orange font-bold rounded-lg shadow-lg transition-all duration-300"
              onClick={handleSignIn}
            >
              Sign In
            </motion.button>
          )}
        </div>
      </div>

      {/* Modal */}
      <dialog id="profile_modal" className="modal">
        <div className="modal-box bg-gray-900 border border-orange-500 w-11/12 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <ProfileContent />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default HomePage;