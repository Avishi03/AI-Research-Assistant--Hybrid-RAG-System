import { Drawer } from "expo-router/drawer";
import CustomDrawerContent from "@/components/app/sidebar";
import { StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";

export default function DrawerLayout() {
  const theme = useTheme();
  return (
    <Drawer
      initialRouteName="index"
      drawerContent={(props) => <CustomDrawerContent props={props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          headerTitle: "",
          headerStyle: {
            backgroundColor: theme.dark ? "black" : "transparent",
            borderBottomColor: theme.dark ? "#282828" : "lightgray",
            borderBottomWidth: 0.5,
          },
          headerShown: true,
          headerRight: () => <Settings />,
          headerRightContainerStyle: {
            paddingRight: 15,
            paddingBottom: 6,
          },
        }}
      />
    </Drawer>
  );
}

function Settings() {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        footerStyles.avatorContainer,
        {
          backgroundColor: theme.dark ? "#282828" : "black",
          borderColor: theme.dark ? "#282828" : "black",
        },
      ]}
      onPress={() => router.push("/modal")}
    >
      <FontAwesome5 name="user-alt" size={12} color={"white"} />
    </TouchableOpacity>
  );
}

const footerStyles = StyleSheet.create({
  avatorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    width: 36,
    height: 36,
    padding: 4,
    borderRadius: 20,
  },
});
