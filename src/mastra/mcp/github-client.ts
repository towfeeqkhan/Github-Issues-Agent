import { MCPClient } from "@mastra/mcp";

export const mcpClient = new MCPClient({
  id: "github-and-custom-mcp-client",
  servers: {
    github: {
      url: new URL("https://api.githubcopilot.com/mcp/"),
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
      },
    },

    issueAnalysis: {
      command: "npx",
      args: ["tsx", "src/mastra/mcp/custom-server.ts"],
    },
  },
});
