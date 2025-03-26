"use client";

import mcpTools from "@/data/mcp-tools.json";

export default function CategoryTabs() {
  const categories = Object.entries(mcpTools.categories).map(
    ([key, category]) => ({
      name: category.name,
      id: key,
    })
  );

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => scrollToCategory(category.id)}
              className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer"
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
