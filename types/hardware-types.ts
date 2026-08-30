export interface HardwareProductType {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  price: number;
  ram: number; // in GB
  cpu: string;
  interfaces: string[];
  ecosystem: number; // 0 to 1 score
  lead_time: number; // in days
  image: string;
}

export interface RequirementsType {
  min_ram?: number;
  max_price?: number;
  required_interfaces?: string[];
  category?: string;
}

export interface InferredNeedType {
  property: string;
  reason: string;
  type: "hard" | "soft";
}

export interface ProjectContextType {
  summary: string;
  needs: InferredNeedType[];
}

export interface EvaluationResultType {
  compatible: HardwareProductType[];
  rejected: { product: HardwareProductType; reason: string }[];
}

export interface ComparisonMatrixType {
  products: HardwareProductType[];
  fields: (keyof HardwareProductType)[];
}

export interface ProcurementItemType {
  product: HardwareProductType;
  quantity: number;
}

export interface ProcurementListType {
  id: string;
  name: string;
  items: ProcurementItemType[];
  status: "draft" | "submitted";
}

export interface RFQType {
  id: string;
  procurementListId: string;
  draftText: string;
  status: "draft" | "sent";
}
