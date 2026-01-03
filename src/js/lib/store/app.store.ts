import { create } from "zustand";
import { ViewId } from "@/lib/config";

type AppState = {
  view: ViewId;
  setView: (view: ViewId) => void;

  isBusy: boolean;
  setBusy: (busy: boolean) => void;

  lastError: string | null;
  setError: (msg: string | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  view: "pagination",
  setView: (view) => set({ view }),

  isBusy: false,
  setBusy: (busy) => set({ isBusy: busy }),

  lastError: null,
  setError: (msg) => set({ lastError: msg }),
}));
