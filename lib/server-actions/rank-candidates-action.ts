"use server";

import { HardwareProductType } from "@/types/hardware-types";

export interface Priorities {
  price?: number; // lower is better
  ram?: number; // higher is better
  ecosystem?: number; // higher is better
  lead_time?: number; // lower is better
}

export async function rankCandidatesAction(products: HardwareProductType[], priorities: Priorities): Promise<HardwareProductType[]> {
  const ranked = [...products].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (priorities.price) {
      scoreA += (1 / a.price) * priorities.price;
      scoreB += (1 / b.price) * priorities.price;
    }

    if (priorities.ram) {
      scoreA += a.ram * priorities.ram;
      scoreB += b.ram * priorities.ram;
    }

    if (priorities.ecosystem) {
      scoreA += a.ecosystem * priorities.ecosystem;
      scoreB += b.ecosystem * priorities.ecosystem;
    }

    if (priorities.lead_time) {
      scoreA += (1 / a.lead_time) * priorities.lead_time;
      scoreB += (1 / b.lead_time) * priorities.lead_time;
    }

    return scoreB - scoreA;
  });

  return ranked;
}
