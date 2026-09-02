"use client";

import { useSelector } from "react-redux";
import { ReduxState } from "@/lib/redux/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mcpClient } from "@/lib/webmcp/mcp-client";

export function HardwareResultsTable() {
  const products = useSelector((state: ReduxState) => state.hardware.products);
  const priorities = useSelector((state: ReduxState) => state.hardware.priorities);

  if (products.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8 border rounded-lg">No hardware candidates found. Execute search_hardware to begin.</div>;
  }

  const handleTogglePriorities = async () => {
    // If ram is currently 0, switch to RAM-heavy. Otherwise switch to price/ecosystem heavy.
    const isRamFocused = (priorities?.ram ?? 0) > 0;
    const newPriorities = isRamFocused
      ? { ecosystem: 10, price: 10, ram: 0, lead_time: 1 }
      : { price: 3, ram: 1, ecosystem: 1, lead_time: 2 };

    await mcpClient.executeTool("rank_candidates", {
      products,
      priorities: newPriorities
    });
  };

  return (
    <div className="flex flex-col space-y-4">
      {priorities && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase text-purple-700 dark:text-purple-400">Current Priorities:</span>
            <div className="flex gap-2">
              {Object.entries(priorities)
                .sort(([,a], [,b]) => b - a)
                .map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {key} (weight: {value})
                  </Badge>
                ))}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleTogglePriorities}>Toggle Priority Profile</Button>
        </div>
      )}
      <div className="rounded-md border max-h-[400px] overflow-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>RAM</TableHead>
            <TableHead>Lead Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.ram}GB</TableCell>
              <TableCell>{product.lead_time} days</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
