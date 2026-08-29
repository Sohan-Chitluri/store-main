type ToolHandler = (args: any) => Promise<any>;

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema?: Record<string, any>;
  handler: ToolHandler;
}

interface MCPClientOptions {
  tools: ToolDefinition[];
}

export class MCPClient {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor(options: MCPClientOptions) {
    options.tools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  public getTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public async executeTool(name: string, args: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }
    return tool.handler(args);
  }
}

import { pingAction } from "@/lib/server-actions/ping-action";

export const mcpClient = new MCPClient({
  tools: [
    {
      name: "ping_hardware",
      description: "Dummy tool to verify WebMCP execution",
      inputSchema: {
        type: "object",
        properties: {
          echo: { type: "string" }
        },
        required: ["echo"]
      },
      handler: async (args: { echo: string }) => {
        return pingAction(args);
      }
    }
  ]
});
