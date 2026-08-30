"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mcpClient } from "@/lib/webmcp/mcp-client";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function SearchHardwareForm() {
  const [minRam, setMinRam] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("single-board-computer");
  const [isRunningDemo, setIsRunningDemo] = useState(false);

  const handleSearch = async () => {
    await mcpClient.executeTool("search_hardware", {
      category,
      min_ram: minRam ? Number(minRam) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined
    });
  };

  const runAutomatedDemo = async () => {
    setIsRunningDemo(true);
    try {
      // 1. Search Hardware
      const products = await mcpClient.executeTool("search_hardware", { category: "single-board-computer", min_ram: 4, max_price: 200 });
      await sleep(1500);

      // 2. Evaluate Requirements
      const evalResult = await mcpClient.executeTool("evaluate_requirements", {
        specs: { min_ram: 8, required_interfaces: ["PCIe", "WiFi"] },
        products
      });
      await sleep(1500);

      const compatibleIds = evalResult.compatible.map((p: any) => p.id);

      // 3. Compare Products
      await mcpClient.executeTool("compare_products", {
        productIds: compatibleIds
      });
      await sleep(1500);

      // 4. Rank Candidates
      const ranked = await mcpClient.executeTool("rank_candidates", {
        products: evalResult.compatible,
        priorities: { price: 3, ram: 1, ecosystem: 1, lead_time: 2 }
      });
      await sleep(2000);

      // HUMAN INTERVENTION
      const reranked = await mcpClient.executeTool("rank_candidates", {
        products: evalResult.compatible,
        priorities: { ecosystem: 10, price: 10, ram: 0, lead_time: 1 }
      });
      await sleep(1500);

      if (reranked.length > 0) {
        // 5. Create Procurement List
        const list = await mcpClient.executeTool("create_procurement_list", {
          name: "Project Alpha Hardware",
          products: [{ productId: reranked[0].id, quantity: 10 }]
        });
        await sleep(1500);

        // 6. Create RFQ
        await mcpClient.executeTool("create_quote_request", {
          listId: list.id
        });
      }

    } finally {
      setIsRunningDemo(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single-board-computer">Single Board Computer</SelectItem>
              <SelectItem value="development-board">Development Board</SelectItem>
              <SelectItem value="compute-module">Compute Module</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="minRam">Min RAM (GB)</Label>
          <Input 
            id="minRam" 
            type="number" 
            placeholder="e.g. 8" 
            value={minRam} 
            onChange={(e) => setMinRam(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price ($)</Label>
          <Input 
            id="maxPrice" 
            type="number" 
            placeholder="e.g. 100" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
          />
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleSearch} className="flex-1" variant="outline">Search Hardware</Button>
        <Button onClick={runAutomatedDemo} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white" disabled={isRunningDemo}>
          {isRunningDemo ? "Running Demo..." : "Run Automated Demo (Agent Simulation)"}
        </Button>
      </div>
    </div>
  );
}
