import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";

function createServer() {
  const server = new McpServer({
    name: "issue-analysis-server",
    version: "1.0.0",
  });

  server.registerTool(
    "analyze_issue_text",
    {
      description:
        "Analyze a GitHub issue's title and body. Extract common sections, identify whether reproduction steps are documented, and return a structured report.",
      inputSchema: z.object({
        issueNumber: z.number().int().positive(),
        title: z.string(),
        body: z.string(),
        state: z.string().optional(),
      }),
    },
    async ({ issueNumber, title, body, state }) => {
      function extractSection(...headingNames: string[]) {
        for (const heading of headingNames) {
          const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

          const regex = new RegExp(
            `^#{1,6}\\s*${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n#{1,6}\\s|$)`,
            "im",
          );

          const match = body.match(regex);

          if (match?.[1]?.trim()) {
            return match[1].trim();
          }
        }

        return null;
      }

      const summary =
        body
          .trim()
          .split(/\n\s*\n/)[0]
          ?.trim() || "No description provided.";

      const reproductionSteps = extractSection(
        "Steps to reproduce",
        "Reproduction steps",
        "How to reproduce",
      );

      const expectedBehavior = extractSection(
        "Expected behavior",
        "Expected result",
      );

      const actualBehavior = extractSection("Actual behavior", "Actual result");

      const report = {
        issueNumber,
        title,
        state: state ?? "unknown",
        summary,
        expectedBehavior,
        actualBehavior,
        reproductionSteps,
        reproductionStepsDocumented: reproductionSteps !== null,
        bodyLength: body.length,
        note:
          reproductionSteps === null
            ? "No recognized reproduction-steps section was found. This does not prove the issue has no reproduction steps."
            : "A reproduction-steps section was found.",
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(report, null, 2),
          },
        ],
      };
    },
  );

  return server;
}

void serveStdio(createServer);
