"use client";

import { useSelector } from "react-redux";
import { ReduxState } from "@/lib/redux/store";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export function ProjectContextPanel() {
  const projectContext = useSelector((state: ReduxState) => state.hardware.projectContext);

  if (!projectContext) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-primary">YOUR PROJECT</h3>
        <p className="text-sm text-muted-foreground">{projectContext.summary}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-3 text-primary">INFERRED NEEDS</h3>
        <ul className="space-y-3">
          {projectContext.needs.map((need, idx) => (
            <li key={idx} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="font-medium text-sm">{need.property}</span>
                <Badge variant={need.type === "hard" ? "default" : "secondary"} className="text-[10px] uppercase">
                  {need.type} constraint
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground pl-6 border-l-2 ml-[7px] border-slate-200 dark:border-slate-800">
                {need.reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
