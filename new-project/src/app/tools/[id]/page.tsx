import { notFound } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

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

async function getTool(id: string): Promise<Tool> {
  const res = await fetch(`http://localhost:3000/api/tools/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound();
  }

  return res.json();
}

export default async function ToolPage({ params }: { params: { id: string } }) {
  const tool = await getTool(params.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">{tool.title}</h1>
            <p className="text-blue-100 text-lg">{tool.description}</p>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  基本信息
                </h2>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">分类</dt>
                    <dd className="text-sm text-gray-900">{tool.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">标签</dt>
                    <dd className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">作者</dt>
                    <dd className="text-sm text-gray-900">{tool.author}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      创建时间
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {format(new Date(tool.createTime), "PPP", {
                        locale: zhCN,
                      })}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* 安装说明 */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  安装说明
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      自动安装
                    </h3>
                    <div className="bg-gray-50 rounded p-3">
                      <code className="text-sm text-gray-900">
                        {tool.installation.auto.command}
                      </code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      手动安装
                    </h3>
                    <div className="bg-gray-50 rounded p-3">
                      <code className="text-sm text-gray-900">
                        {tool.installation.manual.command}{" "}
                        {tool.installation.manual.args.join(" ")}
                      </code>
                    </div>
                    {Object.keys(tool.installation.manual.env).length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          环境变量
                        </h4>
                        <div className="bg-gray-50 rounded p-3">
                          <pre className="text-sm text-gray-900">
                            {Object.entries(tool.installation.manual.env)
                              .map(([key, value]) => `${key}=${value}`)
                              .join("\n")}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* GitHub 链接 */}
            <div>
              <a
                href={tool.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaGithub className="mr-2 h-5 w-5" />在 GitHub 上查看
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
