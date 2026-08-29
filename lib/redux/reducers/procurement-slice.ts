import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProcurementListType, RFQType } from "@/types/hardware-types";

interface ProcurementState {
  list: ProcurementListType | null;
  rfq: RFQType | null;
}

const initialState: ProcurementState = {
  list: null,
  rfq: null,
};

const procurementSlice = createSlice({
  name: "procurement",
  initialState,
  reducers: {
    setProcurementList(state, action: PayloadAction<ProcurementListType | null>) {
      state.list = action.payload;
    },
    setRFQ(state, action: PayloadAction<RFQType | null>) {
      state.rfq = action.payload;
    }
  },
});

export const { setProcurementList, setRFQ } = procurementSlice.actions;
export default procurementSlice.reducer;
