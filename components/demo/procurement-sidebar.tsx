"use client";

import { useSelector } from "react-redux";
import { ReduxState } from "@/lib/redux/store";

export function ProcurementSidebar() {
  const list = useSelector((state: ReduxState) => state.procurement.list);
  const rfq = useSelector((state: ReduxState) => state.procurement.rfq);

  if (!list) {
    return <div className="text-sm text-muted-foreground text-center py-8 border rounded-lg">No procurement list created yet.</div>;
  }

  const totalCost = list.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="flex flex-col space-y-6 max-h-[400px] overflow-auto">
      <div>
        <h3 className="font-medium text-md mb-2">{list.name}</h3>
        <ul className="space-y-3">
          {list.items.map(item => (
            <li key={item.product.id} className="text-sm flex justify-between items-center border-b pb-2 last:border-0">
              <div className="flex flex-col">
                <span className="font-medium">{item.product.name}</span>
                <span className="text-muted-foreground text-xs">Qty: {item.quantity}</span>
              </div>
              <span className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t flex justify-between font-bold">
          <span>Total Estimate:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </div>

      {rfq && (
        <div className="bg-slate-50 dark:bg-slate-900 border rounded p-4">
          <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">RFQ Draft Created</h4>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap">{rfq.draftText}</p>
        </div>
      )}
    </div>
  );
}
