import { useCallback, useEffect, useState } from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  useDrawerStatus,
} from "@react-navigation/drawer";
import {
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import useChatId from "@/store/chatId";
import { useChats } from "@/hooks/useChats";
import Entypo from "@expo/vector-icons/Entypo";
import { type Chats } from "@/types";
import { useTheme } from "@react-navigation/native";

function CustomDrawerContent({
  props,
}: {
  props: DrawerContentComponentProps;
}) {
  const theme = useTheme();
  const [fetch, setFetch] = useState<boolean>(false);
  const { chats, loading } = useChats(fetch);
  const drawerStatus = useDrawerStatus();
  const { updateChatId } = useChatId();

  useEffect(() => {
    if (drawerStatus === "open") {
      setFetch(true);
    } else if (drawerStatus === "closed") {
      setFetch(false);
    }
  }, [drawerStatus]);

  const closeDrawer = () => {
    props.navigation.closeDrawer();
  };

  const handleNewChat = () => {
    updateChatId(null);
    closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={sidebarStyles.scrollView}
      style={{ backgroundColor: theme.dark ? "#121212" : "white" }}
    >
      <View style={sidebarStyles.container}>
        <TouchableOpacity
          style={sidebarStyles.newChatContainer}
          onPress={() => handleNewChat()}
        >
          <Entypo
            name="new-message"
            size={22}
            color={theme.dark ? "white" : "black"}
          />
          <Text
            style={[
              sidebarStyles.newChatText,
              { color: theme.dark ? "white" : "black" },
            ]}
          >
            New Chat
          </Text>
        </TouchableOpacity>
        <Chats
          theme={theme}
          chats={chats}
          loading={loading}
          closeDrawer={closeDrawer}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const sidebarStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
    height: "100%",
  },
  newChatContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  newChatText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

function Chats({
  chats,
  loading,
  closeDrawer,
  theme,
}: {
  theme: ReactNavigation.Theme;
  chats: Chats;
  loading: boolean;
  closeDrawer: () => void;
}) {
  const { updateChatId } = useChatId();

  const handleChatPress = (chatId: string) => {
    updateChatId(chatId);
    closeDrawer();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "transparent" }}
      contentContainerStyle={chatsStyles.container}
    >
      {loading ? (
        <View style={chatsStyles.loaderContainer}>
          <ActivityIndicator
            size="small"
            color={theme.dark ? "white" : "black"}
          />
        </View>
      ) : (
        chats.map((chat: any) => {
          return (
            <TouchableOpacity
              key={chat._id}
              onPress={() => handleChatPress(chat._id)}
            >
              <Text
                style={[
                  chatsStyles.titleText,
                  { color: theme.dark ? "white" : "black" },
                ]}
								numberOfLines={1}
              >
                {chat.title}
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
}

const chatsStyles = StyleSheet.create({
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 16,
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomDrawerContent;
