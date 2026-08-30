"use server";

import { InferredNeedType, ProjectContextType } from "@/types/hardware-types";

export interface AnalyzeProjectResult {
  context: ProjectContextType;
  query: { category?: string; min_ram?: number; max_price?: number };
  specs: { min_ram?: number; required_interfaces?: string[] };
  priorities: { price: number; ram: number; ecosystem: number; lead_time: number };
}

export async function analyzeProjectAction(description: string): Promise<AnalyzeProjectResult> {
  const lowerDesc = description.toLowerCase();
  
  const needs: InferredNeedType[] = [];
  const query: AnalyzeProjectResult["query"] = { category: "single-board-computer" };
  const specs: AnalyzeProjectResult["specs"] = { required_interfaces: [] };
  let priorities = { price: 1, ram: 1, ecosystem: 1, lead_time: 1 };

  if (lowerDesc.includes("ros") || lowerDesc.includes("ros2") || lowerDesc.includes("ros 2")) {
    needs.push({
      property: "Linux / ROS 2",
      reason: "Inferred because your project mentions ROS 2.",
      type: "soft"
    });
    priorities.ecosystem += 5; // ROS usually means we want a board with a good ecosystem
  }

  if (lowerDesc.includes("camera") || lowerDesc.includes("perception") || lowerDesc.includes("vision")) {
    needs.push({
      property: "Camera support",
      reason: "Inferred because your project mentions camera-based perception.",
      type: "soft"
    });
    specs.required_interfaces!.push("CSI");
  }

  if (lowerDesc.includes("computer vision") || lowerDesc.includes("performance") || lowerDesc.includes("ml") || lowerDesc.includes("ai")) {
    needs.push({
      property: "Compute performance",
      reason: "Prioritized because your project mentions computer vision.",
      type: "soft"
    });
    priorities.ram += 5;
    query.min_ram = 4;
  }

  if (lowerDesc.includes("cheap") || lowerDesc.includes("affordable") || lowerDesc.includes("low cost") || lowerDesc.includes("student")) {
    needs.push({
      property: "Cost sensitivity",
      reason: "Inferred from affordable project constraints.",
      type: "soft"
    });
    priorities.price += 10;
    query.max_price = 150;
  }

  // Support for human in the loop override: "Actually, price is more important than performance"
  if (lowerDesc.includes("price is more important")) {
    priorities.price += 20;
    priorities.ram = 0;
  }

  // Create a neat summary based on what was detected
  let summary = "Custom project analysis based on description.";
  if (lowerDesc.includes("rover")) {
    summary = "Autonomous ROS 2 rover with camera-based perception.";
  } else if (lowerDesc.includes("drone")) {
    summary = "Autonomous drone with computer vision.";
  }

  return {
    context: {
      summary,
      needs
    },
    query,
    specs,
    priorities
  };
}
