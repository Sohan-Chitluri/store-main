"use client";

import { useSelector, useDispatch } from "react-redux";
import { ReduxState } from "@/lib/redux/store";
import { toggleTraceExpanded, clearTraceEntries } from "@/lib/redux/reducers/trace-panel-slice";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export function TracePanel() {
  const { entries, expanded } = useSelector((state: ReduxState) => state.tracePanel);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {entries.length} tool calls logged
        </p>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => dispatch(clearTraceEntries())}>
            Clear
          </Button>
          <Button variant="secondary" size="sm" onClick={() => dispatch(toggleTraceExpanded(!expanded))}>
            {expanded ? "Collapse Details" : "Expand Details"}
          </Button>
        </div>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-auto border rounded bg-background p-4 font-mono text-sm">
        {entries.length === 0 ? (
          <div className="text-muted-foreground italic text-center py-4">No trace events yet...</div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="border-b last:border-0 pb-4 last:pb-0">
              <div className="flex items-center space-x-2 mb-2">
                {entry.status === 'pending' && <Icons.spinner className="animate-spin text-blue-500 w-4 h-4" />}
                {entry.status === 'success' && <Icons.CheckIcon className="text-green-500 w-4 h-4" />}
                {entry.status === 'error' && <Icons.XMarkIcon className="text-red-500 w-4 h-4" />}
                
                <span className="font-semibold">{entry.toolName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
                {entry.duration && (
                  <span className="text-xs text-muted-foreground">
                    ({entry.duration}ms)
                  </span>
                )}
              </div>
              
              {expanded && (
                <div className="bg-slate-100 dark:bg-slate-800 rounded p-2 text-xs overflow-x-auto space-y-2 mt-2">
                  <div>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">ARGS:</span> 
                    <pre className="max-h-[150px] overflow-auto border-l-2 border-blue-500 pl-2 mt-1">{JSON.stringify(entry.args, null, 2)}</pre>
                  </div>
                  {Boolean(entry.result) && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                      <span className="text-green-600 dark:text-green-400 font-bold">RESULT:</span> 
                      <pre className="max-h-[150px] overflow-auto border-l-2 border-green-500 pl-2 mt-1">{JSON.stringify(entry.result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
