"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ToolsFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (searchTerm: string) => void;
}

export default function ToolsFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  onSearchChange,
}: ToolsFilterProps) {
  return (
    <div className="space-y-6">
      {/* 搜索框 */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          placeholder="搜索工具..."
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          key="all"
          onClick={() => onCategoryChange("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selectedCategory === ""
              ? "bg-purple-100 text-purple-800 ring-2 ring-purple-500 ring-offset-2"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          全部
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category.id
                ? "bg-purple-100 text-purple-800 ring-2 ring-purple-500 ring-offset-2"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
