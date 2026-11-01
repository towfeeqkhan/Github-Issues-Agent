import { MCPClient } from "@mastra/mcp";

export const githubMCPClient = new MCPClient({
  id: "github-mcp-client",
  servers: {
    github: {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
      },
    },
  },
});
