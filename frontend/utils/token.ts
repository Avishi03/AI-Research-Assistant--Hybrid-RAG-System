import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const getToken = async () => {
	const token = await AsyncStorage.getItem("token");
	return token;
};

export const storeToken = async (firebaseId: string) => {
	try {
		const response = await axios.post(
			`${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/signin`,
			{
				fid: firebaseId,
			},
		);
		if (response.status === 200 && response.data.token) {
			await AsyncStorage.setItem("token", response.data.token);
			return 1;
		}
		return 0;
	} catch (error) {
		console.log(error);
		return 0;
	}
};

export const removeToken = async () => {
	await AsyncStorage.removeItem("token");
};
