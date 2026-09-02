"use server";

import productsData from "@/data/hardware-products.json";
import { HardwareProductType, RequirementsType } from "@/types/hardware-types";

export async function searchHardwareAction(query: { min_ram?: number; max_price?: number; category?: string; }) {
  const products = productsData as HardwareProductType[];

  let candidates = products;

  if (query.category) {
    candidates = candidates.filter(p => p.category === query.category);
  }
  
  if (query.min_ram !== undefined) {
    const minRam = query.min_ram;
    candidates = candidates.filter(p => p.ram >= minRam);
  }

  if (query.max_price !== undefined) {
    const maxPrice = query.max_price;
    candidates = candidates.filter(p => p.price <= maxPrice);
  }

  return candidates;
}
