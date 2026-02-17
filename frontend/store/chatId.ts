import { create } from "zustand";

interface ChatId {
	chatId: string | null;
	updateChatId: (
		chatId: string | null,
	) => void;
	resetChatId: () => void;
}

const useChatId = create<ChatId>((set) => ({
	chatId: null,
	updateChatId: (
		chatId: string | null,
	) => set({ chatId }),
	resetChatId: () => set({ chatId: null }),
}));

export default useChatId;
