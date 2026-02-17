import { create } from "zustand";
import { ThemeStorage } from "@/utils/mmkv";

interface Theme {
	theme: string | null;
	updateTheme: (
		theme: string | null,
	) => void;
}

const useTheme = create<Theme>((set) => ({
	theme: ThemeStorage.get(),
	updateTheme: (
		theme: string | null,
	) => {
		set({ theme });
		ThemeStorage.set(theme);
	},
}));

export default useTheme;
