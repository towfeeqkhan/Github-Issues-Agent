import { Mastra } from "@mastra/core";
import { githubIssuesAgent } from "./agents/github-issues-agent";

export const mastra = new Mastra({
  agents: {
    githubIssuesAgent,
  },
});
