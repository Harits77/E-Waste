import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-slate-800 shadow-md">
        <h1 className="text-2xl font-bold text-emerald-400">E-Waste Exchange</h1>
        <Link
          to="/login"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-md transition"
        >
          Login
        </Link>
      </nav>

      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to <span className="text-emerald-400">E-Waste Exchange</span>
        </h2>
        <p className="text-lg md:text-xl max-w-2xl text-gray-300 mb-8">
          Buy, sell, and responsibly recycle your electronic gadgets. Connect with eco-conscious users.
        </p>
        <div className="flex gap-4">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-semibold"
          >
            Get Started
          </Link>
       
        </div>
      </div>
    </div>
  );
};

export default Home;
