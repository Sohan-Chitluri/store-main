"use client";

import { useSelector } from "react-redux";
import { ReduxState } from "@/lib/redux/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function HardwareResultsTable() {
  const products = useSelector((state: ReduxState) => state.hardware.products);

  if (!products || products.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8 border rounded-lg">No hardware candidates found. Execute search_hardware to begin.</div>;
  }

  return (
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
  );
}
