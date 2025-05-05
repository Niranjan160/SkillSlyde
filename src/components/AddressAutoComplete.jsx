import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressAutoComplete = ({ onSelectAddress }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [timer, setTimer] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce: wait 500ms after user stops typing
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);
    setTimer(newTimer);
  };

  const fetchSuggestions = async (value) => {
    if (!value) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`);
      setSuggestions(res.data);
    } catch (err) {
      console.error("Failed to fetch address suggestions", err);
    }
  };

  const handleSelect = async (suggestion) => {
    const lat = suggestion.lat;
    const lon = suggestion.lon;

    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const place = res.data;
      console.log("place: ",place);
      
      onSelectAddress(place);
      setSuggestions([]);
      setQuery(place.display_name);
    } catch (err) {
      console.error("Failed to fetch selected address details", err);
    }
  };

  return (
    <div className="col-span-2 relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search Address"
        className="input"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto rounded shadow">
          {suggestions.map((sug, index) => (
            <li
              key={index}
              className="p-2 hover:bg-indigo-100 cursor-pointer text-sm"
              onClick={() => handleSelect(sug)}
            >
              {sug.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutoComplete;
