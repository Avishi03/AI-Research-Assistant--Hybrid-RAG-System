import {
	GoogleSignin,
	isNoSavedCredentialFoundResponse,
	isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { removeToken, storeToken } from "./token";

export const googleSignIn = async () => {
	try {
		const response = await GoogleSignin.signIn();

		if (isNoSavedCredentialFoundResponse(response as any)) {
			console.log("No saved credentials found");
		}

		if (isSuccessResponse(response)) {
			const idToken = response.data.idToken;

			const googleCredential = auth.GoogleAuthProvider.credential(idToken);
			const userCredential =
				await auth().signInWithCredential(googleCredential);
			const result = await storeToken(userCredential.user.uid);
			if (result === 0) {
				throw new Error("Failed to store token");
			}
			console.log("Signed in to Firebase with Google");
		}
	} catch (error) {
		console.error("Sign-in error:", error);
	}
};

export async function phoneSignIn(mobile: string) {
	try {
		const phone = `+91${mobile}`;
		console.log(phone);
		auth().settings.appVerificationDisabledForTesting = true;
		const confirmation = await auth().signInWithPhoneNumber(phone);
		return confirmation;
	} catch (e: any) {
		console.log(e);
	}
}

export const signOut = async () => {
	await GoogleSignin.signOut();
	await auth().signOut();
	await removeToken();
};
