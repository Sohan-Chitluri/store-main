"use server";

import { RFQType, ProcurementListType } from "@/types/hardware-types";
import crypto from "crypto";

export async function createQuoteRequestAction(listId: string, listData?: ProcurementListType): Promise<RFQType> {
  let draftText = ``;

  if (listData && listData.items.length > 0) {
    draftText += `HardwareScout RFQ\n\nPlease provide your best quote and estimated lead time for:\n\n`;
    
    listData.items.forEach((item, index) => {
      const lineTotal = item.product.price * item.quantity;
      draftText += `${index + 1}. ${item.product.name}\n`;
      draftText += `   Quantity: ${item.quantity}\n`;
      draftText += `   Unit price: $${item.product.price.toFixed(2)}\n`;
      draftText += `   Line total: $${lineTotal.toFixed(2)}\n\n`;
    });
    
    draftText += `Please provide your best quote and estimated lead time.`;
  } else {
    draftText = `RFQ for Procurement List: ${listId}\n\nPlease provide your best quote and estimated lead time for the components listed. Standard vendor terms apply.`;
  }

  return {
    id: crypto.randomUUID(),
    procurementListId: listId,
    draftText,
    status: "draft"
  };
}
