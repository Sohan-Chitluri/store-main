type ToolHandler = (args: unknown) => Promise<unknown>;

interface ToolDefinition {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  handler: ToolHandler;
}

interface MCPClientOptions {
  tools: ToolDefinition[];
}

export class MCPClient {
  private tools = new Map<string, ToolDefinition>();

  constructor(options: MCPClientOptions) {
    options.tools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });
  }

  public getTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public async executeTool(name: string, args: unknown): Promise<unknown> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool ${name} not found`);
    }

    const traceId = crypto.randomUUID();
    const startTime = Date.now();

    reduxStore.dispatch(addTraceEntry({
      id: traceId,
      toolName: name,
      args,
      status: "pending",
      timestamp: startTime,
    }));

    try {
      const result = await tool.handler(args);
      const duration = Date.now() - startTime;

      reduxStore.dispatch(updateTraceEntry({
        id: traceId,
        status: "success",
        result,
        duration,
      }));

      return result;
    } catch (error: unknown) {
      const duration = Date.now() - startTime;
      const message = error instanceof Error ? error.message : "Unknown error";
      reduxStore.dispatch(updateTraceEntry({
        id: traceId,
        status: "error",
        result: message,
        duration,
      }));
      throw error;
    }
  }
}

import { searchHardwareSchema, evaluateRequirementsSchema, compareProductsSchema, rankCandidatesSchema, createProcurementListSchema, createQuoteRequestSchema, analyzeProjectSchema } from "./mcp-schemas";
import { searchHardwareAction } from "@/lib/server-actions/search-hardware-action";
import { analyzeProjectAction } from "@/lib/server-actions/analyze-project-action";
import { evaluateRequirementsAction } from "@/lib/server-actions/evaluate-requirements-action";
import { compareProductsAction } from "@/lib/server-actions/compare-products-action";
import { rankCandidatesAction } from "@/lib/server-actions/rank-candidates-action";
import { createProcurementListAction } from "@/lib/server-actions/create-procurement-list-action";
import { createQuoteRequestAction } from "@/lib/server-actions/create-quote-request-action";
import { reduxStore } from "@/lib/redux/store";
import { setProducts, setEvaluation, setComparison, setPriorities, setProjectContext } from "@/lib/redux/reducers/hardware-slice";
import { setProcurementList, setRFQ } from "@/lib/redux/reducers/procurement-slice";
import { addTraceEntry, updateTraceEntry } from "@/lib/redux/reducers/trace-panel-slice";
import type { HardwareProductType, RequirementsType } from "@/types/hardware-types";
import type { Priorities } from "@/lib/server-actions/rank-candidates-action";

interface AnalyzeProjectArgs {
  description: string;
}

interface EvaluateRequirementsArgs {
  specs: RequirementsType;
  products: HardwareProductType[];
}

interface CompareProductsArgs {
  productIds: string[];
}

interface RankCandidatesArgs {
  products: HardwareProductType[];
  priorities: Priorities;
}

interface CreateProcurementListArgs {
  name: string;
  products: { productId: string; quantity: number }[];
}

interface CreateQuoteRequestArgs {
  listId: string;
}

export const mcpClient = new MCPClient({
  tools: [
    {
      name: "analyze_project",
      description: "Analyze natural language project description",
      inputSchema: analyzeProjectSchema,
      handler: async (args: unknown) => {
        const { description } = args as AnalyzeProjectArgs;
        const result = await analyzeProjectAction(description);
        reduxStore.dispatch(setProjectContext(result.context));
        return result;
      }
    },
    {
      name: "search_hardware",
      description: "Search for hardware products",
      inputSchema: searchHardwareSchema,
      handler: async (args: unknown) => {
        const result = await searchHardwareAction(args as RequirementsType);
        reduxStore.dispatch(setProducts(result));
        return result;
      }
    },
    {
      name: "evaluate_requirements",
      description: "Evaluate products against requirements",
      inputSchema: evaluateRequirementsSchema,
      handler: async (args: unknown) => {
        const { specs, products } = args as EvaluateRequirementsArgs;
        const result = await evaluateRequirementsAction(specs, products);
        reduxStore.dispatch(setEvaluation(result));
        return result;
      }
    },
    {
      name: "compare_products",
      description: "Compare selected hardware products",
      inputSchema: compareProductsSchema,
      handler: async (args: unknown) => {
        const { productIds } = args as CompareProductsArgs;
        const result = await compareProductsAction(productIds);
        reduxStore.dispatch(setComparison(result));
        return result;
      }
    },
    {
      name: "rank_candidates",
      description: "Rank hardware products based on human priorities",
      inputSchema: rankCandidatesSchema,
      handler: async (args: unknown) => {
        const { products, priorities } = args as RankCandidatesArgs;
        const result = await rankCandidatesAction(products, priorities);
        // Ranking typically updates the candidate list order
        reduxStore.dispatch(setProducts(result));
        reduxStore.dispatch(setPriorities({
          price: priorities.price ?? 0,
          ram: priorities.ram ?? 0,
          ecosystem: priorities.ecosystem ?? 0,
          lead_time: priorities.lead_time ?? 0,
        }));
        return result;
      }
    },
    {
      name: "create_procurement_list",
      description: "Create an itemized procurement list",
      inputSchema: createProcurementListSchema,
      handler: async (args: unknown) => {
        const { name, products } = args as CreateProcurementListArgs;
        const result = await createProcurementListAction(name, products);
        reduxStore.dispatch(setProcurementList(result));
        return result;
      }
    },
    {
      name: "create_quote_request",
      description: "Create a draft request for quote",
      inputSchema: createQuoteRequestSchema,
      handler: async (args: unknown) => {
        const { listId } = args as CreateQuoteRequestArgs;
        const state = reduxStore.getState();
        const listData = state.procurement.list;
        const passedListData = (listData && listData.id === listId) ? listData : undefined;

        const result = await createQuoteRequestAction(listId, passedListData);
        reduxStore.dispatch(setRFQ(result));
        return result;
      }
    }
  ]
});
