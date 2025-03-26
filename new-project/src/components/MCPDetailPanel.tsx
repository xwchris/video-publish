"use client";

import { useEffect } from "react";
import { X, Github, Copy, AlertCircle } from "lucide-react";

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

interface MCPDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
}

export default function MCPDetailPanel({
  isOpen,
  onClose,
  tool,
}: MCPDetailPanelProps) {
  // 处理滚动锁定
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* 背景遮罩 */}
        <div
          className="fixed inset-0 bg-black/25 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* 弹窗内容 */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
          {/* 头部 */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {tool.title}
                </h2>
                <p className="text-gray-500">{tool.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tool.tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href={tool.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <button
                  type="button"
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* 内容 */}
          <div className="px-6 py-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
            <div className="space-y-6">
              {/* 自动安装 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  自动安装
                </h3>
                <div className="relative">
                  <pre className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 overflow-x-auto">
                    {tool.installation.auto.command}
                  </pre>
                  <button
                    type="button"
                    className="absolute top-3 right-3 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        tool.installation.auto.command
                      );
                    }}
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* 手动配置 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  手动配置
                </h3>
                <div>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    <p className="mb-4">
                      1. 创建或编辑 <code>.cursor/mcp.json</code> 文件：
                    </p>
                    <div className="relative">
                      <pre className="overflow-x-auto">
                        {JSON.stringify(
                          {
                            command: tool.installation.manual.command,
                            args: tool.installation.manual.args,
                            env: tool.installation.manual.env,
                          },
                          null,
                          2
                        )}
                      </pre>
                      <button
                        type="button"
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-purple-600 transition-colors"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(
                              {
                                command: tool.installation.manual.command,
                                args: tool.installation.manual.args,
                                env: tool.installation.manual.env,
                              },
                              null,
                              2
                            )
                          );
                        }}
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p>2. 在 Cursor 设置中启用 MCP</p>
                      <p>3. 重启 Cursor 以应用更改</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 环境变量说明 */}
              {Object.keys(tool.installation.manual.env).length > 0 && (
                <div className="rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        环境变量说明
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc list-inside space-y-1">
                          {Object.entries(tool.installation.manual.env).map(
                            ([key, description], index) => (
                              <li key={`${key}-${index}`}>
                                <code>{key}</code>: {description}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
