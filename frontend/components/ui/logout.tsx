import { router } from "expo-router";
import React from "react";
import { Alert, View } from "react-native";
import { auth } from "@/firebase-config";
import { signOut } from "firebase/auth";

import ButtonComponent from "./buttonComponent";

interface LogoutButtonProps {
  buttonStyles?: string;
  textStyles?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  buttonStyles,
  textStyles,
}) => {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await logout();
          router.navigate("/signin");
        },
      },
    ]);
  };

  return (
    <View>
      <ButtonComponent
        buttonStyles={`rounded-2xl py-3 h-auto ${buttonStyles}`}
        textStyles={`${textStyles}`}
        msg="Sign Out"
        onclick={handleLogout}
      />
    </View>
  );
};

export default LogoutButton;
