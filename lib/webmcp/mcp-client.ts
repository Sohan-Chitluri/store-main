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

import { searchHardwareSchema, evaluateRequirementsSchema, compareProductsSchema, rankCandidatesSchema, createProcurementListSchema, createQuoteRequestSchema } from "./mcp-schemas";
import { searchHardwareAction } from "@/lib/server-actions/search-hardware-action";
import { evaluateRequirementsAction } from "@/lib/server-actions/evaluate-requirements-action";
import { compareProductsAction } from "@/lib/server-actions/compare-products-action";
import { rankCandidatesAction } from "@/lib/server-actions/rank-candidates-action";
import { reduxStore } from "@/lib/redux/store";
import { setProducts, setEvaluation, setComparison } from "@/lib/redux/reducers/hardware-slice";

export const mcpClient = new MCPClient({
  tools: [
    {
      name: "search_hardware",
      description: "Search for hardware products",
      inputSchema: searchHardwareSchema,
      handler: async (args: any) => {
        const result = await searchHardwareAction(args);
        reduxStore.dispatch(setProducts(result));
        return result;
      }
    },
    {
      name: "evaluate_requirements",
      description: "Evaluate products against requirements",
      inputSchema: evaluateRequirementsSchema,
      handler: async (args: any) => {
        const result = await evaluateRequirementsAction(args.specs, args.products);
        reduxStore.dispatch(setEvaluation(result));
        return result;
      }
    },
    {
      name: "compare_products",
      description: "Compare selected hardware products",
      inputSchema: compareProductsSchema,
      handler: async (args: any) => {
        const result = await compareProductsAction(args.productIds);
        reduxStore.dispatch(setComparison(result));
        return result;
      }
    },
    {
      name: "rank_candidates",
      description: "Rank hardware products based on human priorities",
      inputSchema: rankCandidatesSchema,
      handler: async (args: any) => {
        const result = await rankCandidatesAction(args.products, args.priorities);
        // Ranking typically updates the candidate list order
        reduxStore.dispatch(setProducts(result));
        return result;
      }
    },
    {
      name: "create_procurement_list",
      description: "Create an itemized procurement list",
      inputSchema: createProcurementListSchema,
      handler: async (args: any) => { return { status: "not_implemented_yet", args }; }
    },
    {
      name: "create_quote_request",
      description: "Create a draft request for quote",
      inputSchema: createQuoteRequestSchema,
      handler: async (args: any) => { return { status: "not_implemented_yet", args }; }
    }
  ]
});
