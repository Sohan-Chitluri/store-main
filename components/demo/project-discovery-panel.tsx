"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { mcpClient } from "@/lib/webmcp/mcp-client";
import { ProjectContextPanel } from "./project-context-panel";
import { useSelector } from "react-redux";
import type { ReduxState } from "@/lib/redux/store";
import { Bot, Sparkles } from "lucide-react";
import type { AnalyzeProjectResult } from "@/lib/server-actions/analyze-project-action";
import type { HardwareProductType, EvaluationResultType } from "@/types/hardware-types";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function ProjectDiscoveryPanel() {
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const projectContext = useSelector((state: ReduxState) => state.hardware.projectContext);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // 1. Analyze Project Context
      const result = await mcpClient.executeTool("analyze_project", { description }) as AnalyzeProjectResult;
      await sleep(1000); // Visual pause for the trace panel

      // 2. Search Hardware based on inferred explicit constraints
      const products = await mcpClient.executeTool("search_hardware", result.query) as HardwareProductType[];
      await sleep(1000);

      if (products.length === 0) return;

      // 3. Evaluate Requirements
      const evalResult = await mcpClient.executeTool("evaluate_requirements", {
        specs: result.specs,
        products
      }) as EvaluationResultType;
      await sleep(1000);

      // 4. Compare Products
      const compatibleIds = evalResult.compatible.map((p) => p.id);
      if (compatibleIds.length > 0) {
        await mcpClient.executeTool("compare_products", {
          productIds: compatibleIds
        });
        await sleep(1000);
      }

      // 5. Rank Candidates based on inferred priorities
      await mcpClient.executeTool("rank_candidates", {
        products: evalResult.compatible,
        priorities: result.priorities
      });

    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6 rounded-xl border shadow-sm">
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold">Describe your project</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Tell us what you&apos;re building in plain English. We&apos;ll extract your engineering requirements and find the best hardware for your use case.
        </p>
        <Textarea 
          placeholder="e.g., I'm building a small autonomous rover. It'll have a camera, run ROS 2, probably do some computer vision, and I want to keep it reasonably cheap..."
          className="min-h-[120px] resize-none bg-background"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
        />
        <Button 
          onClick={handleAnalyze} 
          disabled={isAnalyzing || !description.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {isAnalyzing ? (
            "Analyzing Project..."
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Project
            </>
          )}
        </Button>
      </div>

      {/* Context Panel renders here if there is a context */}
      <div className="flex-1 md:border-l md:pl-8">
        {projectContext ? (
          <ProjectContextPanel />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground space-y-3 py-8">
            <Sparkles className="w-8 h-8 opacity-20" />
            <p className="text-sm">Enter a project description to see inferred constraints and priorities.</p>
          </div>
        )}
      </div>
    </div>
  );
}
