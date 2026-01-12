// create store for merchant registration for save step and data

import { create } from "zustand";

interface RegistrationState {
  step: "email" | "form" | "success";
  setStep: (step: "email" | "form" | "success") => void;
}

export const useRegistrationStore = create<RegistrationState>((set) => ({
  step: "email",
  setStep: (step) => set({ step }),
}));
