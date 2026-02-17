import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Chats } from "@/types";

export function useChats(fetch: boolean) {
	const [loading, setLoading] = useState<boolean>(false);
	const [chats, setChats] = useState<Chats>([]);

	const fetchChats = async () => {
		try {
			setLoading(true);
			const token = await AsyncStorage.getItem("token");
			const res: any = await axios.get(
				`${process.env.EXPO_PUBLIC_BACKEND_URL}/chat/chats`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (res.status !== 200) {
				throw new Error(res.data.message || "Something went wrong");
			}
			console.log("chats fetched");
			setChats(res.data.chats);
		} catch (e: any) {
			console.log(e.message || "Something went wrong");
			setChats([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (fetch) {
			fetchChats();
		}
	}, [fetch]);

	return {
		loading,
		chats,
	};
}
