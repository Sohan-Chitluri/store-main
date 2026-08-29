import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HardwareProductType, EvaluationResultType, ComparisonMatrixType } from "@/types/hardware-types";

interface HardwareState {
  products: HardwareProductType[];
  evaluation: EvaluationResultType | null;
  comparison: ComparisonMatrixType | null;
  loading: boolean;
}

const initialState: HardwareState = {
  products: [],
  evaluation: null,
  comparison: null,
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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    }
  },
});

export const { setProducts, setEvaluation, setComparison, setLoading } = hardwareSlice.actions;
export default hardwareSlice.reducer;
