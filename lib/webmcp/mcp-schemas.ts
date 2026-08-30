export const searchHardwareSchema = {
  type: "object",
  properties: {
    min_ram: { type: "number", description: "Minimum RAM in GB" },
    max_price: { type: "number", description: "Maximum price in USD" },
    category: { type: "string", description: "Hardware category e.g., 'single-board-computer'" }
  }
};

export const analyzeProjectSchema = {
  type: "object",
  properties: {
    description: { type: "string", description: "Natural language description of the project" }
  },
  required: ["description"]
};

export const evaluateRequirementsSchema = {
  type: "object",
  properties: {
    specs: {
      type: "object",
      properties: {
        min_ram: { type: "number" },
        max_price: { type: "number" },
        required_interfaces: {
          type: "array",
          items: { type: "string" }
        },
        category: { type: "string" }
      }
    },
    products: {
      type: "array",
      description: "List of HardwareProductType objects to evaluate"
    }
  },
  required: ["specs", "products"]
};

export const compareProductsSchema = {
  type: "object",
  properties: {
    productIds: {
      type: "array",
      items: { type: "string" },
      description: "List of product IDs to compare"
    }
  },
  required: ["productIds"]
};

export const rankCandidatesSchema = {
  type: "object",
  properties: {
    products: {
      type: "array",
      description: "List of HardwareProductType objects to rank"
    },
    priorities: {
      type: "object",
      properties: {
        price: { type: "number", description: "Priority weight for price (lower is better)" },
        ram: { type: "number", description: "Priority weight for ram (higher is better)" },
        ecosystem: { type: "number", description: "Priority weight for ecosystem (higher is better)" },
        lead_time: { type: "number", description: "Priority weight for lead time (lower is better)" }
      }
    }
  },
  required: ["products", "priorities"]
};

export const createProcurementListSchema = {
  type: "object",
  properties: {
    name: { type: "string", description: "Name of the procurement list" },
    products: {
      type: "array",
      description: "List of products with quantities",
      items: {
        type: "object",
        properties: {
          productId: { type: "string" },
          quantity: { type: "number" }
        },
        required: ["productId", "quantity"]
      }
    }
  },
  required: ["name", "products"]
};

export const createQuoteRequestSchema = {
  type: "object",
  properties: {
    listId: { type: "string", description: "ID of the procurement list to request quote for" }
  },
  required: ["listId"]
};
