// mmkv.ts (Your centralized storage file)
import { MMKV } from 'react-native-mmkv';

// 1. Create the single instance here
export const storage = new MMKV();

// 2. You can also create centralized methods for complex data (e.g., a theme object)
export const ThemeStorage = {
	get: () => storage.getString('app-theme') || '',
	set: (theme: string | null) => {
		if (theme) {
			storage.set('app-theme', theme);
		} else {
			storage.delete('app-theme');
		}
	},
};