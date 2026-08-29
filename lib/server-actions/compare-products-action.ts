"use server";

import productsData from "@/data/hardware-products.json";
import { HardwareProductType, ComparisonMatrixType } from "@/types/hardware-types";

export async function compareProductsAction(productIds: string[]): Promise<ComparisonMatrixType> {
  const products = productsData as HardwareProductType[];
  const selectedProducts = products.filter(p => productIds.includes(p.id));

  const fields: (keyof HardwareProductType)[] = ["price", "ram", "cpu", "ecosystem", "lead_time"];

  return {
    products: selectedProducts,
    fields
  };
}
