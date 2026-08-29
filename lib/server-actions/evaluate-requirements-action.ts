"use server";

import { HardwareProductType, RequirementsType, EvaluationResultType } from "@/types/hardware-types";

export async function evaluateRequirementsAction(specs: RequirementsType, products: HardwareProductType[]): Promise<EvaluationResultType> {
  const compatible: HardwareProductType[] = [];
  const rejected: { product: HardwareProductType; reason: string }[] = [];

  for (const p of products) {
    let isCompatible = true;
    let reason = "";

    if (specs.category && p.category !== specs.category) {
      isCompatible = false;
      reason = `Incorrect category. Required: ${specs.category}`;
    } else if (specs.min_ram !== undefined && p.ram < specs.min_ram) {
      isCompatible = false;
      reason = `Insufficient RAM. Required >= ${specs.min_ram}GB`;
    } else if (specs.max_price !== undefined && p.price > specs.max_price) {
      isCompatible = false;
      reason = `Exceeds max price of $${specs.max_price}`;
    } else if (specs.required_interfaces && specs.required_interfaces.length > 0) {
      const missing = specs.required_interfaces.filter(req => !p.interfaces.includes(req));
      if (missing.length > 0) {
        isCompatible = false;
        reason = `Missing required interfaces: ${missing.join(", ")}`;
      }
    }

    if (isCompatible) {
      compatible.push(p);
    } else {
      rejected.push({ product: p, reason });
    }
  }

  return { compatible, rejected };
}
