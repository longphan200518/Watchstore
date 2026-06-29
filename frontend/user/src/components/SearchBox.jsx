import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";

export default function SearchBox({ language = "vi" }) {
 const [searchQuery, setSearchQuery] = useState("");
 const [suggestions, setSuggestions] = useState([]);
 const [showSuggestions, setShowSuggestions] = useState(false);
 const [searchHistory, setSearchHistory] = useState([]);
 const [isFocused, setIsFocused] = useState(false);
 const navigate = useNavigate();

 const commonSearches = [
 { vi: "Äá»“ng há»“ nam", en: "Men's Watches" },
 { vi: "Äá»“ng há»“ ná»¯", en: "Women's Watches" },
 { vi: "Rolex", en: "Rolex" },
 { vi: "Omega", en: "Omega" },
 { vi: "Seiko", en: "Seiko" },
 { vi: "Casio", en: "Casio" },
 { vi: "Tissot", en: "Tissot" },
 ];

 useEffect(() => {
 fetchSearchHistory();
 }, []);

 const fetchSearchHistory = async () => {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) return;

 try {
 const response = await fetch("http://localhost:5221/api/searchhistory", {
 headers: {
 Authorization: `Bearer ${token}`
 }
 });
 const result = await response.json();
 if (result.success && result.data) {
 setSearchHistory(result.data);
 }
 } catch (err) {
 console.error("Failed to fetch search history", err);
 }
 };

 const clearSearchHistory = async (e) => {
 e.stopPropagation();
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) return;

 try {
 const response = await fetch("http://localhost:5221/api/searchhistory", {
 method: "DELETE",
 headers: {
 Authorization: `Bearer ${token}`
 }
 });
 const result = await response.json();
 if (result.success) {
 setSearchHistory([]);
 }
 } catch (err) {
 console.error("Failed to clear search history", err);
 }
 };

 useEffect(() => {
 if (searchQuery.trim().length > 0) {
 const filtered = commonSearches.filter((item) =>
 item[language].toLowerCase().includes(searchQuery.toLowerCase())
 );
 setSuggestions(filtered);
 setShowSuggestions(true);
 } else {
 setSuggestions([]);
 // When query is empty, we don't show common searches as suggestions, // but we might want to show them if no history. We handle this in render.
 }
 }, [searchQuery, language]);

 const handleSearch = (query) => {
 if (query.trim()) {
 navigate(`/products?search=${encodeURIComponent(query)}`);
 setSearchQuery("");
 setShowSuggestions(false);
 setIsFocused(false);
 // Re-fetch history after search
 setTimeout(fetchSearchHistory, 1000);
 }
 };

 const handleKeyPress = (e) => {
 if (e.key === "Enter") {
 handleSearch(searchQuery);
 }
 };

 const handleSuggestionClick = (suggestion) => {
 const searchText = typeof suggestion === 'string' ? suggestion : suggestion[language];
 handleSearch(searchText);
 };

 // Close dropdown when clicking outside (simple blur with delay)
 const handleBlur = () => {
 setTimeout(() => {
 setIsFocused(false);
 setShowSuggestions(false);
 }, 200);
 };

 const showDropdown = isFocused || showSuggestions;

 return (
 <div className="relative w-full max-w-xs">
 <div
 className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 bg-white border-gray-300 focus-within:border-black`}
 >
 <Icon icon="teenyicons:search-outline" width={18} />
 <input
 type="text"
 placeholder={language === "vi" ? "TÃ¬m kiáº¿m..." : "Search..."}
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onKeyPress={handleKeyPress}
 onFocus={() => setIsFocused(true)}
 onBlur={handleBlur}
 className={`flex-1 outline-none text-sm bg-transparent text-black placeholder-gray-400`}
 />
 {searchQuery && (
 <button
 onClick={() => {
 setSearchQuery("");
 setSuggestions([]);
 setIsFocused(true);
 }}
 className={`text-black hover:opacity-70 transition`}
 >
 <Icon icon="teenyicons:x-small" width={18} />
 </button>
 )}
 </div>

 {/* Suggestions Dropdown */}
 {showDropdown && (
 <div
 className={`absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg border z-50 overflow-hidden bg-white border-gray-200`}
 >
 {searchQuery.trim().length === 0 ? (
 /* Show Search History or Common Searches */
 <>
 {searchHistory.length > 0 ? (
 <div>
 <div className={`flex justify-between items-center px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b text-neutral-500 border-gray-200`}>
 <span>{language === "vi" ? "Lá»‹ch sá»­ tÃ¬m kiáº¿m" : "Search History"}</span>
 <button onClick={clearSearchHistory} className="hover:underline">
 {language === "vi" ? "XÃ³a" : "Clear"}
 </button>
 </div>
 {searchHistory.map((historyItem, idx) => (
 <button
 key={idx}
 onClick={() => handleSuggestionClick(historyItem.searchTerm)}
 className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-black/10 transition text-black hover:bg-black/5`}
 >
 <Icon icon="teenyicons:time-outline" width={16} className="opacity-50" />
 <span className="text-sm">{historyItem.searchTerm}</span>
 </button>
 ))}
 </div>
 ) : (
 <div>
 <div className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold border-b text-neutral-500 border-gray-200`}>
 <span>{language === "vi" ? "TÃ¬m kiáº¿m phá»• biáº¿n" : "Popular Searches"}</span>
 </div>
 {commonSearches.slice(0, 5).map((suggestion, idx) => (
 <button
 key={idx}
 onClick={() => handleSuggestionClick(suggestion)}
 className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-black/10 transition text-black hover:bg-black/5`}
 >
 <Icon icon="teenyicons:trending-up-outline" width={16} className="opacity-50" />
 <span className="text-sm">{suggestion[language]}</span>
 </button>
 ))}
 </div>
 )}
 </>
 ) : (
 /* Show Suggestions based on query */
 suggestions.length > 0 ? (
 suggestions.map((suggestion, idx) => (
 <button
 key={idx}
 onClick={() => handleSuggestionClick(suggestion)}
 className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-black/10 transition text-black hover:bg-black/5`}
 >
 <Icon icon="teenyicons:search-outline" width={16} className="opacity-50" />
 <span className="text-sm">{suggestion[language]}</span>
 </button>
 ))
 ) : (
 <div className={`px-4 py-3 text-sm text-neutral-500`}>
 {language === "vi" ? "KhÃ´ng tÃ¬m tháº¥y gá»£i Ã½" : "No suggestions found"}
 </div>
 )
 )}
 </div>
 )}
 </div>
 );
}

