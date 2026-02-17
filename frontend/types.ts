export interface Chunk {
    chunk?: string;
    finished: boolean;
    entire_msg?: string;
    chatId?: string;
}

export interface Message {
    id: string;
    response: string;
    prompt: string;
    isLoading: boolean;
}

export type Chats = {
    _id: string;
    title: string;
    createdAt: string;
}[];

export type Chat = {
    _id: string;
    isUser: boolean;
    message: string;
    createdAt: string;
}[];