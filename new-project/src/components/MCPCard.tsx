"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import MCPDetailPanel from "./MCPDetailPanel";
import FormattedDate from "./FormattedDate";

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

interface MCPCardProps {
  tool: Tool;
}

export default function MCPCard({ tool }: MCPCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const tags = tool.tags || [];

  return (
    <>
      <div
        className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer h-[220px] hover:scale-[1.02]"
        onClick={() => setIsDetailOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent h-24" />
        <div className="relative p-6 flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
              {tool.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
              {tool.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <FormattedDate date={tool.createTime} />
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <MCPDetailPanel
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        tool={tool}
      />
    </>
  );
}
