import { Stack } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "index",
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          title: "otp",
        }}
      />
      <Stack.Screen
        name="test"
        options={{
          title: "test",
        }}
      />
    </Stack>
  );
}
