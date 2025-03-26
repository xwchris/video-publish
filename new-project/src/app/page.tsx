"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MCPCard from "@/components/MCPCard";
import ToolsFilter from "@/components/ToolsFilter";

interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  installation: {
    auto: {
      command: string;
    };
    manual: {
      command: string;
      args: string[];
      env: Record<string, string>;
    };
  };
  githubUrl: string;
  author: string;
  createTime: string;
}

interface Category {
  id: string;
  tools: Tool[];
}

interface ToolsData {
  categories: Category[];
}

// 缓存相关的常量
const CACHE_KEY = "mcp_tools_data";
const CACHE_TIMESTAMP_KEY = "mcp_tools_timestamp";
const CACHE_DURATION = 1000 * 60 * 60; // 1小时的缓存时间

// 获取工具数据的函数
async function getTools(): Promise<ToolsData> {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const now = Date.now();

    // 如果有缓存数据，先返回缓存
    if (cachedData) {
      const parsedData = JSON.parse(cachedData) as ToolsData;
      // 确保数据结构正确
      if (!Array.isArray(parsedData?.categories)) {
        throw new Error("缓存数据格式错误");
      }

      // 如果缓存过期，在后台更新缓存
      if (!cachedTimestamp || now - Number(cachedTimestamp) >= CACHE_DURATION) {
        updateCache().catch(console.error);
      }
      return parsedData;
    }

    // 如果没有缓存，则直接获取新数据
    return fetchNewData();
  } catch (error) {
    console.error("获取缓存数据失败:", error);
    // 如果缓存读取失败，直接获取新数据
    return fetchNewData();
  }
}

// 获取新数据的函数
async function fetchNewData(): Promise<ToolsData> {
  try {
    const response = await fetch("/api/tools");
    if (!response.ok) {
      throw new Error("获取工具列表失败");
    }
    const data = await response.json();

    // 验证数据结构
    if (!Array.isArray(data?.categories)) {
      throw new Error("API返回数据格式错误");
    }

    // 更新缓存
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, String(Date.now()));

    return data;
  } catch (error) {
    console.error("获取数据失败:", error);
    // 返回空数据结构
    return { categories: [] };
  }
}

// 异步更新缓存的函数
async function updateCache() {
  try {
    const data = await fetchNewData();
    console.log("缓存已在后台更新");
    return data;
  } catch (error) {
    console.error("更新缓存失败:", error);
  }
}

export default function Home() {
  const [toolsData, setToolsData] = useState<ToolsData>({ categories: [] });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 初始加载数据
    getTools()
      .then((data) => {
        setToolsData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "未知错误");
        setLoading(false);
      });
  }, []);

  // 获取分类的显示名称
  function getCategoryDisplayName(id: string): string {
    const categoryMap: Record<string, string> = {
      开发工具: "开发工具",
      AI助手: "AI 助手",
      生产力工具: "生产力工具",
      数据工具: "数据工具",
    };
    return categoryMap[id] || id;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">加载中...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">加载失败: {error}</div>
        </main>
      </div>
    );
  }

  const categories = toolsData.categories.map((category) => ({
    id: category.id,
    name: getCategoryDisplayName(category.id),
  }));

  const filteredCategories = toolsData.categories
    .filter((category) => {
      // 如果选择了分类且不匹配当前分类，跳过
      if (selectedCategory && selectedCategory !== category.id) {
        return false;
      }

      // 过滤工具
      const filteredTools = category.tools.filter((tool) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          tool.title.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      });

      return filteredTools.length > 0;
    })
    .map((category) => ({
      ...category,
      name: getCategoryDisplayName(category.id),
      tools: category.tools.filter((tool) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          tool.title.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }),
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 过滤器 */}
        <div className="mb-8">
          <ToolsFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchTerm}
          />
        </div>

        {/* 分类列表 */}
        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h2>

              {/* 工具网格 */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => (
                  <MCPCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ))}

          {/* 无结果提示 */}
          {filteredCategories.length === 0 && (
            <div className="text-center text-gray-500">没有找到匹配的工具</div>
          )}
        </div>
      </main>
    </div>
  );
}
