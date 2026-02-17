import { create } from "zustand";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface Confirm {
  confirm: FirebaseAuthTypes.ConfirmationResult | null | undefined;
  updateConfirm: (
    confirm: FirebaseAuthTypes.ConfirmationResult | null | undefined,
  ) => void;
  resetConfirm: () => void;
}

const useConfirm = create<Confirm>((set) => ({
  confirm: null as FirebaseAuthTypes.ConfirmationResult | null | undefined,
  updateConfirm: (
    confirm: FirebaseAuthTypes.ConfirmationResult | null | undefined,
  ) => set({ confirm }),
  resetConfirm: () => set({ confirm: null }),
}));

export default useConfirm;
