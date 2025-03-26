import Navbar from "@/components/Navbar";
import { Github, Mail, Twitter } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* 头部区域 */}
          <div className="px-6 py-12 bg-gradient-to-r from-purple-600 to-purple-800 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              关于 MCP 工具集
            </h1>
            <p className="text-purple-100 text-lg max-w-2xl mx-auto">
              我们致力于为开发者提供高质量的 MCP（Model Context Protocol）工具，
              帮助开发者更好地使用 AI 模型进行开发。
            </p>
          </div>

          {/* 主要内容 */}
          <div className="px-6 py-8">
            {/* 项目介绍 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                项目介绍
              </h2>
              <div className="prose prose-purple max-w-none">
                <p className="text-gray-600 mb-4">
                  MCP 工具集是一个开源项目，旨在收集和展示优质的 MCP 工具。
                  我们相信，通过标准化的 Model Context Protocol， 可以让 AI
                  模型更好地理解和处理各种开发场景。
                </p>
                <p className="text-gray-600 mb-4">我们的目标是：</p>
                <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                  <li>收集和整理高质量的 MCP 工具</li>
                  <li>提供详细的工具使用文档和示例</li>
                  <li>促进 MCP 工具的开发和改进</li>
                  <li>建立活跃的开发者社区</li>
                </ul>
              </div>
            </section>

            {/* 加入我们 */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                加入我们
              </h2>
              <p className="text-gray-600 mb-6">
                我们欢迎所有对 MCP 工具感兴趣的开发者参与进来。
                无论是提交新的工具、改进现有工具，还是分享使用经验，
                都可以帮助我们建设更好的 MCP 生态。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                  href="https://github.com/your-repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-6 py-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                >
                  <Github className="h-6 w-6 text-gray-700 mr-3" />
                  <span className="text-gray-900 font-medium">
                    在 GitHub 上贡献
                  </span>
                </a>
                <a
                  href="mailto:contact@example.com"
                  className="flex items-center justify-center px-6 py-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                >
                  <Mail className="h-6 w-6 text-gray-700 mr-3" />
                  <span className="text-gray-900 font-medium">联系我们</span>
                </a>
              </div>
            </section>

            {/* 开源协议 */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                开源协议
              </h2>
              <p className="text-gray-600">
                MCP 工具集采用 MIT 协议开源。我们鼓励开发者在遵守协议的前提下，
                自由使用、修改和分发这些工具。
              </p>
            </section>
          </div>

          {/* 底部 */}
          <div className="px-6 py-8 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/your-account"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="mailto:contact@example.com"
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
