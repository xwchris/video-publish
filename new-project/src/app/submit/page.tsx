"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Github, AlertCircle } from "lucide-react";

interface FormData {
  title: string;
  description: string;
  githubUrl: string;
  category: string;
  tags: string;
  autoCommand: string;
  manualCommand: string;
  envVars: string;
}

const inputStyles =
  "form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm";
const selectStyles =
  "form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm";
const textareaStyles =
  "form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm";

export default function SubmitPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    githubUrl: "",
    category: "开发工具",
    tags: "",
    autoCommand: "",
    manualCommand: "",
    envVars: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: "提交成功！我们会尽快审核您的 MCP 工具。",
        });
        // 重置表单
        setFormData({
          title: "",
          description: "",
          githubUrl: "",
          category: "开发工具",
          tags: "",
          autoCommand: "",
          manualCommand: "",
          envVars: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "提交失败，请稍后重试。",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "提交失败，请稍后重试。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* 头部区域 */}
          <div className="px-6 py-12 bg-gradient-to-r from-purple-600 to-purple-800">
            <h1 className="text-3xl font-bold text-white mb-4 text-center">
              提交 MCP 工具
            </h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto text-center">
              分享您的 MCP 工具，帮助更多开发者提升开发效率
            </p>
          </div>

          <div className="px-6 py-8">
            {/* 提交指南 */}
            <div className="mb-8 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                提交指南
              </h2>
              <ul className="list-disc list-inside text-purple-800 space-y-2 text-sm">
                <li>确保您的 MCP 工具已经在 GitHub 上开源</li>
                <li>提供清晰的工具描述和使用说明</li>
                <li>包含必要的安装命令和环境变量配置</li>
                <li>选择合适的分类和标签</li>
              </ul>
            </div>

            {/* 提交表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    工具名称 *
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="例如：Figma Context MCP"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    工具描述 *
                  </label>
                  <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className={textareaStyles}
                    placeholder="请详细描述您的工具功能和特点..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="githubUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    GitHub 仓库地址 *
                  </label>
                  <input
                    type="url"
                    id="githubUrl"
                    required
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, githubUrl: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              {/* 分类和标签 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  分类和标签
                </h3>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    分类 *
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className={selectStyles}
                  >
                    <option value="开发工具">开发工具</option>
                    <option value="AI助手">AI助手</option>
                    <option value="生产力工具">生产力工具</option>
                    <option value="数据工具">数据工具</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tags"
                    className="block text-sm font-medium text-gray-700"
                  >
                    标签（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="例如：API, Docker, 开发"
                  />
                </div>
              </div>

              {/* 安装配置 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">安装配置</h3>
                <div>
                  <label
                    htmlFor="autoCommand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    自动安装命令 *
                  </label>
                  <input
                    type="text"
                    id="autoCommand"
                    required
                    value={formData.autoCommand}
                    onChange={(e) =>
                      setFormData({ ...formData, autoCommand: e.target.value })
                    }
                    className={inputStyles}
                    placeholder="npx your-mcp-tool"
                  />
                </div>

                <div>
                  <label
                    htmlFor="manualCommand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    手动安装命令
                  </label>
                  <input
                    type="text"
                    id="manualCommand"
                    value={formData.manualCommand}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        manualCommand: e.target.value,
                      })
                    }
                    className={inputStyles}
                    placeholder="npx your-mcp-tool --option=value"
                  />
                </div>

                <div>
                  <label
                    htmlFor="envVars"
                    className="block text-sm font-medium text-gray-700"
                  >
                    环境变量（每行一个，格式：KEY=说明）
                  </label>
                  <textarea
                    id="envVars"
                    value={formData.envVars}
                    onChange={(e) =>
                      setFormData({ ...formData, envVars: e.target.value })
                    }
                    rows={3}
                    className={textareaStyles}
                    placeholder="API_KEY=您的API密钥&#10;DATABASE_URL=数据库连接地址"
                  />
                </div>
              </div>

              {/* 提交状态 */}
              {submitStatus.type && (
                <div
                  className={`p-4 rounded-md ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              {/* 提交按钮 */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "提交中..." : "提交工具"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
