import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 py-4 mt-10 text-center text-gray-400 absolute bottom-0">
      <p>
        &copy; {new Date().getFullYear()} Robotics Club. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
