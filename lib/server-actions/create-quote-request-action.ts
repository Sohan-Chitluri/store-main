"use server";

import { RFQType } from "@/types/hardware-types";
import crypto from "crypto";

export async function createQuoteRequestAction(listId: string): Promise<RFQType> {
  return {
    id: crypto.randomUUID(),
    procurementListId: listId,
    draftText: `RFQ for Procurement List: ${listId}\n\nPlease provide your best quote and estimated lead time for the components listed. Standard vendor terms apply.`,
    status: "draft"
  };
}
