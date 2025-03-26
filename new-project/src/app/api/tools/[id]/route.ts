import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = "xwchris";
const REPO_NAME = "mcp-tools-data";
const BRANCH = "main";

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
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
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf8"
      );
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    return null;
  }
}

// GET /api/tools/[id] - 获取工具详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 获取工具元数据
    const metaContent = await getFileContent(`tools/${id}/meta.json`);
    if (!metaContent) {
      return NextResponse.json({ error: "工具不存在" }, { status: 404 });
    }

    return NextResponse.json(metaContent);
  } catch (error) {
    console.error("Error in GET /api/tools/[id]:", error);
    return NextResponse.json({ error: "获取工具详情失败" }, { status: 500 });
  }
}
