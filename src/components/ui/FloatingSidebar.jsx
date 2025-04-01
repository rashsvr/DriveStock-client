// components/FloatingSidebar.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FloatingSidebar = () => {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
      )
    },
    {
      id: "profile",
      title: "Profile",
      path: "/profile",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: "orders",
      title: "Orders",
      path: "/orders",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    },
    {
      id: "products",
      title: "Products",
      path: "/products",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M2 8h20" />
          <path d="M9 13h6" />
        </svg>
      )
    }
  ];

  const iconCount = icons.length; // Now 4
  const baseHeight = 80;
  const iconHeight = 62;
  const collapsedHeight = baseHeight + (iconCount * iconHeight * 0.95);
  const expandedHeight = baseHeight + (iconCount * iconHeight * 1);

  return (
    <motion.div 
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center space-y-6 p-4 rounded-xl bg-gray-900/90 border-2 border-orange-500 shadow-xl shadow-orange-500/30 transition-all"
      animate={{ 
        width: isExpanded ? 69 : 64, 
        height: isExpanded ? expandedHeight : collapsedHeight 
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
          onClick={() => navigate(item.path)}
        >
          <motion.div
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-dark-bluish-black text-orange-500 text-xs rounded-md shadow-md border border-orange-500/30 z-50"
            initial={{ opacity: 0, x: 10 }}
            animate={{
              opacity: activeIcon === item.id ? 1 : 0,
              x: activeIcon === item.id ? 0 : 10
            }}
            transition={{ 
              duration: 0.2,
              ease: "easeOut",
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            {item.title}
          </motion.div>

          <motion.div
            className="relative z-10 flex items-center justify-center text-orange-500 transition-colors group-hover:text-orange-300"
            whileHover={{ y: -3 }}
            animate={{ width: isExpanded ? 41 : 38, height: isExpanded ? 41 : 38 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
          >
            {item.icon}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FloatingSidebar;