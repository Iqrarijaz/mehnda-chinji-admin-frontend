"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { hasPermission } from "@/utils/permissions";
import MenuList from "./MenuList";

const GlobalSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearchLinks, setRecentSearchLinks] = useState([]);
  const containerRef = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearchLinks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const saveToRecent = (item) => {
    const updated = [item.link, ...recentSearchLinks.filter(l => l !== item.link)].slice(0, 5);
    setRecentSearchLinks(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  // Flatten menu items for easier searching
  const searchableItems = React.useMemo(() => {
    const flat = [];
    MenuList.forEach((item) => {
      // Logic for top level items
      if (hasPermission(item)) {
        if (item.subItems) {
          item.subItems.forEach((sub) => {
            if (hasPermission(sub)) {
              flat.push({ ...sub, parentName: item.name });
            }
          });
        } else if (item.link) {
          flat.push(item);
        }
      }
    });
    return flat;
  }, []);

  const hydratedRecent = React.useMemo(() => {
    return recentSearchLinks
      .map(link => searchableItems.find(item => item.link === link))
      .filter(Boolean);
  }, [recentSearchLinks, searchableItems]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const filtered = searchableItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8); // Top 8 results

    setResults(filtered);
    setSelectedIndex(-1);
    setIsOpen(true);
  }, [query, searchableItems]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleNavigate(results[selectedIndex].link);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleNavigate = (item) => {
    saveToRecent(item);
    router.push(item.link);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightMatch = (text, match) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === match.toLowerCase() ? (
            <span key={i} className="text-[#006666] font-bold">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="relative w-full max-w-[370px] hidden md:block" ref={containerRef}>
      <div className="relative group">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#006666] transition-colors pointer-events-none" size={14} />
        <input
          type="text"
          placeholder="Jump to module..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full h-[32px] pl-9 pr-4 bg-white/10 border border-white/20 rounded-[2px] text-xs text-white placeholder:text-white/40 focus:outline-none focus:bg-white focus:text-slate-800 dark:focus:bg-slate-800 dark:focus:text-slate-100 transition-all focus:border-[#006666] focus:ring-4 focus:ring-teal-900/10"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E293B] rounded-lg shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-[100] transform transition-all duration-200">
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
            {query.trim() === "" ? (
              hydratedRecent.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-1 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 mb-1">
                    <p className="text-[10px] font-bold text-[#006666] dark:text-teal-400 uppercase tracking-widest">Recent Searches</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentSearchLinks([]);
                        localStorage.removeItem("recentSearches");
                      }}
                      className="text-[9px] text-red-400 font-bold hover:underline uppercase"
                    >
                      Clear
                    </button>
                  </div>
                  {hydratedRecent.map((item, index) => (
                    <button
                      key={`recent-${index}`}
                      onClick={() => handleNavigate(item)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all text-slate-600 dark:text-slate-300 pl-4 border-l-4 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                    >
                      <span className="text-[18px] flex-shrink-0 text-slate-300">
                        {item.icon}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-medium tracking-tight leading-none text-slate-700 dark:text-slate-100">{item.name}</span>
                        {item.parentName && (
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold mt-1 tracking-tighter opacity-80">
                            {item.parentName}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-slate-50/30 dark:bg-slate-900/10">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
                    <FiSearch size={20} className="text-slate-200" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose">Ready to Explore?</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 px-6">Type a module name like 'Reports' or 'Users' to jump instantly</p>
                </div>
              )
            ) : results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-1 flex items-center justify-between border-b border-slate-50 dark:border-slate-800 mb-1">
                  <p className="text-[10px] font-bold text-[#006666] dark:text-teal-400 uppercase tracking-widest">Navigation</p>
                  <span className="text-[9px] text-slate-300 font-medium">{results.length} results</span>
                </div>
                {results.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigate(item)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${index === selectedIndex ? "bg-teal-50 dark:bg-teal-900/20 text-[#006666] dark:text-teal-400 pl-6 border-l-4 border-[#006666]" : "hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 pl-4 border-l-4 border-transparent"
                      }`}
                  >
                    <span className={`text-[18px] flex-shrink-0 ${index === selectedIndex ? "text-[#006666]" : "text-slate-300"}`}>
                      {item.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-medium tracking-tight leading-none text-slate-700 dark:text-slate-100">
                        {highlightMatch(item.name, query)}
                      </span>
                      {item.parentName && (
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold mt-1 tracking-tighter opacity-80">
                          Section: {item.parentName}
                        </span>
                      )}
                    </div>
                    {index === selectedIndex && (
                      <span className="ml-auto text-[9px] bg-teal-600 text-white px-1.5 py-0.5 rounded-sm font-black uppercase tracking-tighter shadow-sm animate-in fade-in duration-300">Enter</span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50/50 dark:bg-slate-900/10">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
                  <FiSearch size={20} className="text-slate-200" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">No matches found</p>
                <p className="text-[10px] text-slate-400 mt-1">Try 'Posts', 'Users' or 'Logs'</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
