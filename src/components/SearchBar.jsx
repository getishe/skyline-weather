import React, { useState } from "react";

/**
 * SearchBar Component
 * Handles user input for searching cities
 * @param {Function} onSearch - Callback function to handle search
 */
const SearchBar = ({ onSearch }) => {
  const [city, setCity] = useState(""); // Local state for input field

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(city);
    onSearch(city); // Call parent component's search handler
    setCity(""); // Clear input after search
  };

  return (
    <div className="mx-auto max-w-screen-xl mt-4 py-5 px-32 bg-gray-300 rounded-lg shadow-xl">
      <div className="flex justify-between items-center flex-row">
        <h1>Skyline</h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {" "}
              Search
            </button>
          </div>
        </form>
      </div>
      {/* <img
        src={background}
        style={{ backgroundImage: `url(${background})` }}
        className="w-full h-15 rounded-lg object-cover mt-4"
        alt="background"
      /> */}
    </div>
  );
};

export default SearchBar;
