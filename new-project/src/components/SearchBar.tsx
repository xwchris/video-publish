"use client";

import { Search, X } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import mcpTools from "@/data/mcp-tools.json";

interface SearchResult {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(term.length > 0);

    if (term.length === 0) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchTermLower = term.toLowerCase();

    Object.entries(mcpTools.categories).forEach(([categoryKey, category]) => {
      category.tools.forEach((tool) => {
        const matchesTitle = tool.title.toLowerCase().includes(searchTermLower);
        const matchesDescription = tool.description
          .toLowerCase()
          .includes(searchTermLower);
        const matchesTags = tool.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTermLower)
        );

        if (matchesTitle || matchesDescription || matchesTags) {
          results.push({
            ...tool,
            category: category.name,
          });
        }
      });
    });

    setSearchResults(results);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="搜索MCP工具..."
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {/* 搜索结果 */}
        {isSearching && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50 max-h-[80vh] overflow-y-auto">
            {searchResults.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {searchResults.map((result) => (
                  <li key={result.title} className="p-4 hover:bg-gray-50">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {result.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {result.description}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {result.category}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                未找到相关工具
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
