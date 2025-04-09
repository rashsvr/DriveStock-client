import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CartContent from "./CartContent";
import api from "../../services/api";

const FloatingSidebar = () => {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const icons = [
    {
      id: "home",
      title: "Home",
      path: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: "products",
      title: "Products",
      path: "/products",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v2m0 12v2m-8-8h2m12 0h2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8l-4 4-4 4" />
        </svg>
      ),
    },
    {
      id: "orders",
      title: "Orders",
      path: "/orders",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H5a2 2 0 0 0-2 2v14l3-3 3 3 3-3 3 3 3-3 3 3V7a2 2 0 0 0-2-2h-4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6m-6 4h6" />
        </svg>
      ),
    },
    {
      id: "cart",
      title: "Cart",
      path: null,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
  ];

  const iconCount = icons.length;
  const baseHeight = 80;
  const iconHeight = 62;
  const collapsedHeight = baseHeight + (iconCount * iconHeight * 0.93);
  const expandedHeight = baseHeight + (iconCount * iconHeight * 0.95);

  const handleIconClick = (item) => {
    if (item.id === "cart") {
      if (!api.isAuthenticated()) {
        navigate("/login");
      } else {
        setIsCartOpen(!isCartOpen);
      }
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <>
      <motion.div
        className="fixed left-4 sm:left-6 top-1/2 -translate-y-1/2 z-60 flex flex-col items-center space-y-4 sm:space-y-6 p-3 sm:p-4 rounded-xl bg-base-100 border-2 border-orange-500/15 shadow-xl shadow-orange-500/30 transition-all md:max-w-[64px]"
        animate={{
          width: ['xs', 'sm'].includes(window.innerWidth < 640 ? 'xs' : 'sm') ? 56 : 64,
          height: isExpanded ? expandedHeight : collapsedHeight,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
      >
        {icons.map((item) => (
          <motion.div
            key={item.id}
            className="relative p-2 cursor-pointer group"
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setActiveIcon(item.id)}
            onHoverEnd={() => setActiveIcon(null)}
            onClick={() => handleIconClick(item)}
          >
            <motion.div
              className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-800 text-orange-500 text-xs rounded-md shadow-md border border-orange-500/30 z-50 hidden sm:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: activeIcon === item.id ? 1 : 0,
                x: activeIcon === item.id ? 0 : -10,
              }}
              transition={{ duration: 0.2, ease: "easeOut", type: "spring", stiffness: 200, damping: 20 }}
            >
              {item.title}
            </motion.div>
            <motion.div
              className="relative z-10 flex items-center justify-center text-orange-500 transition-colors group-hover:text-orange-300"
              whileHover={{ y: -3 }}
              animate={{
                width: ['xs', 'sm'].includes(window.innerWidth < 640 ? 'xs' : 'sm') ? 32 : 38,
                height: ['xs', 'sm'].includes(window.innerWidth < 640 ? 'xs' : 'sm') ? 32 : 38,
              }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              {item.icon}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="fixed right-0 top-0 h-full w-64 sm:w-80 bg-base-100 border-l border-orange-500 z-50"
        initial={{ x: "100%" }}
        animate={{ x: isCartOpen ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <CartContent onClose={() => setIsCartOpen(false)} />
      </motion.div>
    </>
  );
};

export default FloatingSidebar;