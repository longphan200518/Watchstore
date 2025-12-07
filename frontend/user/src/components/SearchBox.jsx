import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function SearchBox({ isDark = false, language = "vi" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const commonSearches = [
    { vi: "Đồng hồ nam", en: "Men's Watches" },
    { vi: "Đồng hồ nữ", en: "Women's Watches" },
    { vi: "Rolex", en: "Rolex" },
    { vi: "Omega", en: "Omega" },
    { vi: "Seiko", en: "Seiko" },
    { vi: "Casio", en: "Casio" },
    { vi: "Tissot", en: "Tissot" },
  ];

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = commonSearches.filter((item) =>
        item[language].toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, language]);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const searchText = suggestion[language];
    handleSearch(searchText);
  };

  return (
    <div className="relative w-full max-w-xs">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 ${
          isDark
            ? "bg-neutral-900 border-gray-700 focus-within:border-amber-600"
            : "bg-white border-gray-300 focus-within:border-amber-600"
        }`}
      >
        <Icon icon="teenyicons:search-outline" width={18} />
        <input
          type="text"
          placeholder={language === "vi" ? "Tìm kiếm..." : "Search..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-1 outline-none text-sm bg-transparent ${
            isDark
              ? "text-white placeholder-gray-500"
              : "text-black placeholder-gray-400"
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSuggestions([]);
            }}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <Icon icon="teenyicons:x-small" width={18} />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg border z-50 ${
            isDark
              ? "bg-neutral-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-amber-600/20 transition first:rounded-t-lg last:rounded-b-lg ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Icon icon="teenyicons:search-outline" width={16} />
              <span className="text-sm">{suggestion[language]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
