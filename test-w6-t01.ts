import { createProcurementListAction } from "./lib/server-actions/create-procurement-list-action";
import { createQuoteRequestAction } from "./lib/server-actions/create-quote-request-action";

async function test() {
  const list = await createProcurementListAction("Test", [{ productId: "sbc-1", quantity: 5 }]);
  console.log(list);
  const rfq = await createQuoteRequestAction(list.id);
  console.log(rfq);
}
test().catch(console.error);
