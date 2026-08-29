"use client";

import { useSelector } from "react-redux";
import { ReduxState } from "@/lib/redux/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ComparisonMatrix() {
  const comparison = useSelector((state: ReduxState) => state.hardware.comparison);

  if (!comparison || comparison.products.length === 0) {
    return <div className="text-sm text-muted-foreground text-center py-8">Select products to compare...</div>;
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Feature</TableHead>
            {comparison.products.map(p => (
              <TableHead key={p.id}>{p.name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparison.fields.map(field => (
            <TableRow key={field}>
              <TableCell className="font-medium capitalize">{field.replace('_', ' ')}</TableCell>
              {comparison.products.map(p => (
                <TableCell key={p.id}>
                  {field === 'price' ? `$${p[field]}` : 
                   field === 'ram' ? `${p[field]}GB` : 
                   field === 'lead_time' ? `${p[field]} days` :
                   p[field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
