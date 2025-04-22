import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-base-200 backdrop-blur-sm border-t border-orange-500/20 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span className="text-orange-400">
            © 2025 DriveStock. All rights reserved.
          </span>
          <div className="flex gap-6">
            <span
              className="text-orange-300 hover:text-orange-200 cursor-pointer transition-colors duration-200"
            >
              Privacy Policy
            </span>
            <span
              className="text-orange-300 hover:text-orange-200 cursor-pointer transition-colors duration-200"
            >
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;