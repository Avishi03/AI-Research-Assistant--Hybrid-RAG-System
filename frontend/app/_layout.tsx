import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { View, Image } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import useTheme from "@/store/theme";

import "@/global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useTheme();
  const { route, loading } = useAuth();
  const router = useRouter();

  const [splashLoader, setSplashLoader] = useState(true);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loading && route) {
      console.log("Navigating to route:", route);
      router.navigate(`${route}`);
    }
  }, [route, loading]);

    useEffect(() => {
      setTimeout(() => {
        setSplashLoader(false);
      }, 5000);
    }, []);

  if (!loaded || loading || splashLoader) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: theme === "dark" ? "black" : "white" }}
      >
        <View className="flex-1 justify-center items-center">
          <LoadingLogo theme={(theme as "dark" | "light") || "light"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ThemeProvider value={theme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

function LoadingLogo({ theme }: { theme: "dark" | "light" }) {
  const translateY = useSharedValue(200);

  useEffect(() => {
    // Define the animation: move to y: 500 and back to y: 0
    translateY.value = withRepeat(
      withSequence(
        // withTiming(160, { duration: 2500 }), // Move down 100pxw
        withTiming(0, { duration: 2500 }), // Move back to 0
        withTiming(200, { duration: 2500 }), // Move up 100px
      ),
      -1, // Infinite loop
      true, // Do not reverse
    );
  }, []);

  // Animated style for the white bar
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <MaskedView
      androidRenderingMode="software"
      style={{
        flexDirection: "row",
        height: 250,
      }}
      maskElement={
        <View
          style={{
            height: 250,
            backgroundColor: "transparent",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("@/assets/new-images/logo.png")}
            className="w-52 h-52"
          />
        </View>
      }
    >
      <View
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          height: "100%",
          width: "100%",
          backgroundColor: theme === "dark" ? "#1c1c1c" : "#dbdbdb",
        }}
      >
        <Animated.View
          style={[
            {
              position: "absolute", // Ensure the bar is positioned over the image
              width: "100%",
              height: 30,
              borderRadius: 2,
              backgroundColor: "#999999",
              zIndex: 10, // Place above the image
            },
            animatedStyle, // Apply the animated style
          ]}
        />
      </View>
    </MaskedView>
  );
}
