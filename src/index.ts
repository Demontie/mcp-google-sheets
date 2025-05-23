import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SERVER_CONFIG } from "./config/index.ts";
import { gsheetsReadTool } from "./tools/gsheets_read.ts";
import { gsheetsWriteTool } from "./tools/gsheets_write.ts";
import { z } from "zod";

async function initServer() {
  const server = new McpServer({
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
    description: SERVER_CONFIG.description,
  });

  server.tool(
    gsheetsReadTool.name,
    gsheetsReadTool.description,
    gsheetsReadTool.parameters,
    gsheetsReadTool.handler
  );

  server.tool(
    gsheetsWriteTool.name,
    gsheetsWriteTool.description,
    gsheetsWriteTool.parameters,
    gsheetsWriteTool.handler
  );

  return server;
}

async function main() {
  const server = await initServer();

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  // @ts-ignore
  process.exit(1);
});
