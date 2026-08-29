import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TraceEntry {
  id: string;
  toolName: string;
  args: any;
  result?: any;
  status: "pending" | "success" | "error";
  duration?: number;
  timestamp: number;
}

interface TracePanelState {
  entries: TraceEntry[];
  expanded: boolean;
}

const initialState: TracePanelState = {
  entries: [],
  expanded: false,
};

const tracePanelSlice = createSlice({
  name: "tracePanel",
  initialState,
  reducers: {
    addTraceEntry(state, action: PayloadAction<TraceEntry>) {
      state.entries.push(action.payload);
    },
    updateTraceEntry(state, action: PayloadAction<Partial<TraceEntry> & { id: string }>) {
      const index = state.entries.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = { ...state.entries[index], ...action.payload };
      }
    },
    clearTraceEntries(state) {
      state.entries = [];
    },
    toggleTraceExpanded(state, action: PayloadAction<boolean>) {
      state.expanded = action.payload;
    }
  },
});

export const { addTraceEntry, updateTraceEntry, clearTraceEntries, toggleTraceExpanded } = tracePanelSlice.actions;
export default tracePanelSlice.reducer;
