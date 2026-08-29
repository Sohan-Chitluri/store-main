"use server";

import productsData from "@/data/hardware-products.json";
import { HardwareProductType, ProcurementListType } from "@/types/hardware-types";
import crypto from "crypto";

export async function createProcurementListAction(name: string, items: { productId: string, quantity: number }[]): Promise<ProcurementListType> {
  const products = productsData as HardwareProductType[];
  
  const resolvedItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    return {
      product,
      quantity: item.quantity
    };
  });

  return {
    id: crypto.randomUUID(),
    name,
    items: resolvedItems,
    status: "draft"
  };
}
// Validated for W6-T01
