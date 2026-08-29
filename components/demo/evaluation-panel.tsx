"use client";

import { useSelector } from "react-redux";
import { ReduxState } from "@/lib/redux/store";
import { Badge } from "@/components/ui/badge";

export function EvaluationPanel() {
  const evaluation = useSelector((state: ReduxState) => state.hardware.evaluation);

  if (!evaluation) {
    return <div className="text-sm text-muted-foreground text-center py-8">Waiting for evaluation...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 max-h-[400px] overflow-auto">
      <div>
        <h3 className="text-sm font-semibold mb-2">Compatible ({evaluation.compatible.length})</h3>
        <div className="flex flex-wrap gap-2">
          {evaluation.compatible.map(p => (
            <Badge key={p.id} variant="default">{p.name}</Badge>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2">Rejected ({evaluation.rejected.length})</h3>
        <ul className="space-y-2 text-sm">
          {evaluation.rejected.map(r => (
            <li key={r.product.id} className="text-muted-foreground">
              <span className="font-medium text-destructive">{r.product.name}</span>: {r.reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
