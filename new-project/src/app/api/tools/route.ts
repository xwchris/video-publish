import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

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

interface IndexData {
  [category: string]: string[];
}

// 缓存相关
let cachedData: ToolsData | null = null;
let lastFetchTime = 0;
let isUpdating = false;
const CACHE_DURATION = 1000 * 60 * 60; // 1小时缓存时间

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "xwchris";
const REPO_NAME = "mcp-tools-data";
const BRANCH = "main";

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// 从 GitHub 获取工具数据
async function fetchToolsFromGitHub(): Promise<ToolsData> {
  try {
    // 获取工具索引
    const indexResponse = await fetch(
      "https://raw.githubusercontent.com/xwchris/mcp-tools-data/main/tools/index.json",
      { cache: "no-store" }
    );
    if (!indexResponse.ok) {
      throw new Error("获取工具索引失败");
    }
    const indexData: IndexData = await indexResponse.json();

    // 获取每个工具的详细信息
    const toolPromises = Object.entries(indexData).map(
      async ([category, tools]) => {
        const toolDetailsPromises = tools.map(async (toolId) => {
          try {
            const toolResponse = await fetch(
              `https://raw.githubusercontent.com/xwchris/mcp-tools-data/main/tools/${toolId}/meta.json`,
              { cache: "no-store" }
            );
            if (!toolResponse.ok) {
              console.error(`获取工具 ${toolId} 的数据失败`);
              return null;
            }
            const toolData = await toolResponse.json();
            return toolData as Tool;
          } catch (error) {
            console.error(`获取工具 ${toolId} 的数据失败:`, error);
            return null;
          }
        });

        const toolDetails = await Promise.all(toolDetailsPromises);
        return {
          id: category,
          tools: toolDetails.filter((tool): tool is Tool => tool !== null),
        };
      }
    );

    const categories = await Promise.all(toolPromises);
    return { categories };
  } catch (error) {
    console.error("从 GitHub 获取工具数据失败:", error);
    throw error;
  }
}

// 异步更新缓存
async function updateCacheAsync() {
  if (isUpdating) return; // 防止并发更新

  isUpdating = true;
  try {
    const data = await fetchToolsFromGitHub();
    cachedData = data;
    lastFetchTime = Date.now();
    console.log("缓存已在后台更新");
  } catch (error) {
    console.error("更新缓存失败:", error);
  } finally {
    isUpdating = false;
  }
}

// 获取工具数据（带缓存）
async function getTools(): Promise<ToolsData> {
  const now = Date.now();

  // 如果有缓存数据，先返回缓存
  if (cachedData) {
    // 如果缓存过期，触发后台更新
    if (now - lastFetchTime >= CACHE_DURATION) {
      updateCacheAsync().catch(console.error);
    }
    return cachedData;
  }

  try {
    // 如果没有缓存，则等待获取新数据
    const data = await fetchToolsFromGitHub();
    cachedData = data;
    lastFetchTime = now;
    return data;
  } catch (error) {
    // 如果获取失败，返回空数据结构而不是错误
    console.error("获取工具列表失败:", error);
    return { categories: [] };
  }
}

// GET /api/tools - 获取所有工具
export async function GET() {
  try {
    const data = await getTools();
    return NextResponse.json(data);
  } catch (error) {
    console.error("获取工具列表失败:", error);
    // 返回空数据结构而不是错误
    return NextResponse.json({ categories: [] });
  }
}

// POST /api/tools - 提交新工具
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const toolId = data.id || generateToolId(data.title);

    // 获取当前索引
    const indexContent = (await getFileContent(
      "tools/index.json"
    )) as ToolsIndex;
    if (!indexContent) {
      return NextResponse.json({ error: "工具索引不存在" }, { status: 404 });
    }

    // 更新索引
    const category = indexContent.categories[data.category];
    if (!category) {
      indexContent.categories[data.category] = {
        name: data.category,
        tools: [],
      };
    }

    const categoryTools = indexContent.categories[data.category].tools;
    const existingToolIndex = categoryTools.indexOf(toolId);
    if (existingToolIndex >= 0) {
      categoryTools[existingToolIndex] = toolId;
    } else {
      categoryTools.push(toolId);
    }

    // 准备工具元数据
    const toolMeta = {
      ...data,
      id: toolId,
      createTime: new Date().toISOString(),
    };

    // 更新文件
    await Promise.all([
      octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: "tools/index.json",
        message: `更新工具索引: ${data.title}`,
        content: Buffer.from(JSON.stringify(indexContent, null, 2)).toString(
          "base64"
        ),
        branch: BRANCH,
      }),
      octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: `tools/${toolId}/meta.json`,
        message: `添加工具: ${data.title}`,
        content: Buffer.from(JSON.stringify(toolMeta, null, 2)).toString(
          "base64"
        ),
        branch: BRANCH,
      }),
    ]);

    return NextResponse.json({ success: true, toolId });
  } catch (error) {
    console.error("Error in POST /api/tools:", error);
    return NextResponse.json({ error: "提交工具失败" }, { status: 500 });
  }
}

function generateToolId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
