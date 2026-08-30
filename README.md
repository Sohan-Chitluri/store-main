# HardwareScout

HardwareScout is an intelligent, agent-driven engineering procurement workspace. It transforms traditional B2C ecommerce into a collaborative environment where AI agents assist hardware engineers in sourcing, evaluating, and purchasing components.

## 1. The Engineering Hardware Sourcing Problem

Hardware engineers spend countless hours manually searching distributor catalogs, comparing datasheets against strict project requirements, and calculating lead times vs. pricing tradeoffs. This manual process is prone to error, especially when balancing fluid project priorities (e.g., "We need this fast" vs. "We need this cheap").

## 2. Why WebMCP Matters

The Model Context Protocol (MCP) provides a standardized way for AI agents to interact with data sources and tools. HardwareScout leverages a **Browser-Native WebMCP Architecture** to bridge the gap between agent reasoning and application state. By embedding MCP tools directly as Next.js Server Actions, the agent can seamlessly read deterministic catalog data and manipulate the application UI in real-time, removing the latency and complexity of external MCP servers.

**Agent → Tool → Application-State Flow:**
The agent decides to execute a tool. The tool (a server action) processes the request and returns a structured result. Crucially, the tool handler immediately dispatches this result to the global Redux store. This causes the UI to visibly update in real-time as the agent works, creating a transparent and collaborative user experience.

## 3. Tool Architecture & Available Tools

The application exposes a robust suite of tools for the agent to execute the procurement workflow. 

| Tool | Input Schema | Output/Result |
|---|---|---|
| `search_hardware` | `{ category: string, min_ram?: number, max_price?: number }` | Array of matched hardware components from the deterministic dataset. |
| `evaluate_requirements` | `{ specs: { min_ram: number, required_interfaces: string[] }, products: Product[] }` | Object categorizing products into `compatible` and `rejected` (with reasons). |
| `compare_products` | `{ productIds: string[] }` | A matrix comparing key features across the selected products. |
| `rank_candidates` | `{ products: Product[], priorities: { price: number, ram: number, ... } }` | Array of products sorted by the weighted human priorities. |
| `create_procurement_list` | `{ name: string, products: { productId: string, quantity: number }[] }` | A generated Procurement List object with an ID. |
| `create_quote_request` | `{ listId: string }` | A generated draft RFQ (Request for Quote) text document. |

## 4. Human-in-the-loop Behavior

Hardware procurement requires human judgment. HardwareScout implements a clear human-in-the-loop priority mechanism.
The human engineer dictates priorities (e.g., `Price > Ecosystem > Lead Time`). When priorities shift, the human adjusts the weighting, and the agent re-executes `rank_candidates`. The Redux store updates immediately, and the `HardwareResultsTable` visibly reflects the new ranking alongside a banner showing the active priority weights.

## 5. Demo Instructions & Workflow

To experience the full procurement workflow:
1. Navigate to `http://localhost:3000/demo`.
2. The agent sequentially executes the workflow:
   `search_hardware` → `evaluate_requirements` → `compare_products` → `rank_candidates`
3. A priority change occurs, and the agent re-ranks the candidates.
4. Finally, the agent executes `create_procurement_list` and `create_quote_request`.
5. Observe the **Visible WebMCP Trace** panel at the bottom, which logs every tool invocation in real-time, including execution duration, structured arguments, and results.

## 6. Real vs. Fallback Simulation

HardwareScout supports a live LLM integration, but live agent interaction during hackathon demos can be unreliable (e.g., API limits, latency).

* **REAL:** True Browser/Agent WebMCP interaction where a live LLM context window drives tool execution.
* **FALLBACK:** An Agent Simulation triggered by the "Run Automated Demo" button. 

**IMPORTANT:** The fallback mechanism is clearly separated in the UI. It simulates the agent by sequentially executing the exact same underlying WebMCP tool handlers with deterministic parameters. It is *not* a mock; it executes the real application logic, but circumvents the live LLM dependency to guarantee a flawless final demo.

## 7. Technology Stack

* **Framework:** Next.js 14 (App Router)
* **State Management:** Redux Toolkit (synchronizes tool execution with UI)
* **Styling:** Tailwind CSS + shadcn/ui
* **Data:** A deterministic, in-memory hardware dataset (`data/hardware-products.json`) guarantees reproducible evaluation and ranking.

## 8. Deployment

HardwareScout is built on Next.js 14 and is natively compatible with Vercel for zero-config deployment.

1. Push this repository to GitHub.
2. Import the project in Vercel.
3. Vercel will automatically detect Next.js and apply the correct build settings (`npm run build`).
4. Ensure environment variables (like Database or Clerk keys) are populated in the Vercel dashboard if enabling live features. The fallback simulation requires no external dependencies.
