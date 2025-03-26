import { Octokit } from "@octokit/rest";

const REPO_OWNER = "xwchris";
const REPO_NAME = "mcp-content";
const BRANCH = "main";

// 初始化 Octokit
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// 获取文件内容
async function getFileContent(path: string) {
  try {
    const response = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      ref: BRANCH,
    });

    if ("content" in response.data) {
      const content = Buffer.from(response.data.content, "base64").toString();
      return content;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    return null;
  }
}

// 获取所有工具数据
export async function getAllTools() {
  const content = await getFileContent("tools/index.json");
  if (!content) return { categories: {} };
  return JSON.parse(content);
}

// 获取工具详情
export async function getToolDetails(toolId: string) {
  const metaContent = await getFileContent(`tools/${toolId}/meta.json`);
  const readmeContent = await getFileContent(`tools/${toolId}/README.md`);

  if (!metaContent) return null;

  return {
    ...JSON.parse(metaContent),
    documentation: readmeContent || "",
  };
}

// 获取博客文章列表
export async function getBlogPosts() {
  const content = await getFileContent("blog/index.json");
  if (!content) return { posts: [] };
  return JSON.parse(content);
}

// 获取博客文章详情
export async function getBlogPost(postId: string) {
  const content = await getFileContent(`blog/${postId}.md`);
  if (!content) return null;

  // 解析 frontmatter 和内容
  const [, frontmatter, ...contentParts] = content.split("---");
  const metadata = parseFrontmatter(frontmatter);
  const postContent = contentParts.join("---").trim();

  return {
    id: postId,
    ...metadata,
    content: postContent,
  };
}

// 解析 frontmatter
function parseFrontmatter(frontmatter: string) {
  const metadata: Record<string, any> = {};
  const lines = frontmatter.trim().split("\n");

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length) {
      const value = valueParts.join(":").trim();
      // 处理数组
      if (value.startsWith("[") && value.endsWith("]")) {
        metadata[key.trim()] = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim());
      } else {
        metadata[key.trim()] = value;
      }
    }
  }

  return metadata;
}

// 提交新工具
export async function submitTool(toolData: any) {
  try {
    // 1. 获取当前工具索引
    const indexContent = await getFileContent("tools/index.json");
    const index = indexContent ? JSON.parse(indexContent) : { categories: {} };

    // 2. 生成工具 ID
    const toolId = toolData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // 3. 创建工具元数据
    const meta = {
      id: toolId,
      title: toolData.title,
      description: toolData.description,
      category: toolData.category,
      tags: toolData.tags.split(",").map((tag: string) => tag.trim()),
      installation: {
        auto: {
          command: toolData.autoCommand,
        },
        manual: {
          command: "npx",
          args: toolData.manualCommand.split(" ").slice(1),
          env: parseEnvVars(toolData.envVars),
        },
      },
      githubUrl: toolData.githubUrl,
      author: "Community", // 可以从用户会话中获取
      createTime: new Date().toISOString(),
    };

    // 4. 创建工具文档
    const readme = `# ${toolData.title}\n\n${toolData.description}\n`;

    // 5. 更新索引
    if (!index.categories[toolData.category]) {
      index.categories[toolData.category] = {
        id: toolData.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        tools: [],
      };
    }
    index.categories[toolData.category].tools.push(toolId);

    // 6. 提交更改
    await octokit.repos.createOrUpdateFiles({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      branch: BRANCH,
      changes: [
        {
          path: "tools/index.json",
          content: JSON.stringify(index, null, 2),
        },
        {
          path: `tools/${toolId}/meta.json`,
          content: JSON.stringify(meta, null, 2),
        },
        {
          path: `tools/${toolId}/README.md`,
          content: readme,
        },
      ],
      message: `Add new tool: ${toolData.title}`,
    });

    return { success: true, toolId };
  } catch (error) {
    console.error("Error submitting tool:", error);
    return { success: false, error: "提交失败，请稍后重试" };
  }
}

// 解析环境变量
function parseEnvVars(envVarsStr: string) {
  const env: Record<string, string> = {};
  const lines = envVarsStr.split("\n");

  for (const line of lines) {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length) {
      env[key.trim()] = valueParts.join("=").trim();
    }
  }

  return env;
}
