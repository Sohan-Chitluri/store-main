import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HardwareProductType, EvaluationResultType, ComparisonMatrixType } from "@/types/hardware-types";

interface HardwareState {
  products: HardwareProductType[];
  evaluation: EvaluationResultType | null;
  comparison: ComparisonMatrixType | null;
  priorities: Record<string, number> | null;
  loading: boolean;
}

const initialState: HardwareState = {
  products: [],
  evaluation: null,
  comparison: null,
  priorities: null,
  loading: false,
};

const hardwareSlice = createSlice({
  name: "hardware",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<HardwareProductType[]>) {
      state.products = action.payload;
    },
    setEvaluation(state, action: PayloadAction<EvaluationResultType | null>) {
      state.evaluation = action.payload;
    },
    setComparison(state, action: PayloadAction<ComparisonMatrixType | null>) {
      state.comparison = action.payload;
    },
    setPriorities(state, action: PayloadAction<Record<string, number> | null>) {
      state.priorities = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  },
});

export const { setProducts, setEvaluation, setComparison, setPriorities, setLoading } = hardwareSlice.actions;
export default hardwareSlice.reducer;
