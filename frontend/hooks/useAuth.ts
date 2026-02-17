import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        setRoute("(drawer)");
      } else {
        setRoute("(tabs)");
        await AsyncStorage.removeItem("token");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    loading,
    route,
  };
};
