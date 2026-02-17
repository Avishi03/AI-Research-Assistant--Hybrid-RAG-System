import { memo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { useTheme } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { type Message as MessageInterface } from "@/types";
import Markdown from "react-native-markdown-display";
import { LoaderKitView } from "react-native-loader-kit";
import { getStyles } from "@/markdown";

const windowWidth = Dimensions.get("window").width;

function ChatWindow({
  messages,
  msgId,
  loadingChat,
  playingId,
  startTts,
  stopTts,
}: {
  msgId: string;
  messages: MessageInterface[];
  loadingChat: boolean;
  playingId: string | null;
  startTts: (msgId: string, text: string) => void;
  stopTts: () => void;
}) {
  const flashListRef = useRef<FlashListRef<MessageInterface>>(null);
  const flatListRef = useRef<FlatList>(null);
  const msgIdRef = useRef<string | null>(null);

  useEffect(() => {
    msgIdRef.current = msgId;
  }, [msgId]);

  useEffect(() => {
    const scrollToEnd = (i: number) => {
      console.log("scrollToIndex...", i);
      flatListRef.current?.scrollToIndex({
        animated: true,
        index: i,
        viewPosition: 0.1,
      });
    };

    const index = messages.findIndex((msg) => msg.id === msgIdRef.current);
    if (messages.length > 0 && index > -1 && !loadingChat) {
      scrollToEnd(index);
    }
  }, [messages, loadingChat]);

  if (loadingChat) {
    return (
      <View
        style={{
          flex: 1,
          width: windowWidth,
          position: "relative",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, width: windowWidth, position: "relative" }}>
      {messages.length === 0 && (
        <Image
          source={require("@/assets/new-images/logo.png")}
          className="w-52 h-52 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-30"
        />
      )}
      {/* <FlashList
        ref={flashListRef}
        data={messages}
        keyExtractor={(item: any) => item.id.toString()}
        onScrollBeginDrag={() => {
          msgIdRef.current = null;
        }}
        style={{
          paddingHorizontal: 10,
          flex: 1,
        }}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginVertical: 12,
            }}
          >
            <Message
              id={item.id}
              message={item.prompt}
              isUser={true}
              isStreaming={item.isStreaming}
              isLoading={false}
              playing={playingId === item.id}
              startTts={startTts}
              stopTts={stopTts}
            />
            <Message
              id={item.id}
              message={item.response}
              isUser={false}
              isStreaming={item.isStreaming}
              isLoading={item.isLoading}
              playing={playingId === item.id}
              startTts={startTts}
              stopTts={stopTts}
            />
          </View>
        )}
      /> */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item: any) => item.id.toString()}
        onScrollBeginDrag={() => {
          msgIdRef.current = null;
        }}
        getItemLayout={(data, index) => {
          return { length: 500, index, offset: 500 * index };
        }}
        style={{
          paddingHorizontal: 10,
          flex: 1,
        }}
        contentContainerStyle={{
          paddingVertical: 20,
        }}
        showsVerticalScrollIndicator={true}
        renderItem={({ item }) => (
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginVertical: 12,
            }}
          >
            <Message
              id={item.id}
              message={item.prompt}
              isUser={true}
              isStreaming={item.isStreaming}
              isLoading={false}
              playing={playingId === item.id}
              startTts={startTts}
              stopTts={stopTts}
            />
            <Message
              id={item.id}
              message={item.response}
              isUser={false}
              isStreaming={item.isStreaming}
              isLoading={item.isLoading}
              playing={playingId === item.id}
              startTts={startTts}
              stopTts={stopTts}
            />
          </View>
        )}
      />
    </View>
  );
}

const Message = memo(
  ({
    id,
    message,
    isUser,
    // isStreaming,
    isLoading,
    playing,
    startTts,
    stopTts,
  }: {
    id: string;
    message: string;
    isUser: boolean;
    isStreaming: boolean;
    isLoading: boolean;
    playing: boolean;
    startTts: (msgId: string, text: string) => void;
    stopTts: () => void;
  }) => {
    const theme = useTheme();
    const markdownStyles = getStyles(theme.dark ? "dark" : "light", 15.5);

    if (isUser) {
      return (
        <View
          className="ml-auto bg-gray-600"
          style={[
            messageStyles.messageContainer,
            { paddingHorizontal: 12, paddingVertical: 12, maxWidth: "80%" },
          ]}
        >
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Inter-Regular",
              color: "white",
            }}
          >
            {message}
          </Text>
        </View>
      );
    }

    return (
      <View
        style={[
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 14,
            marginRight: "auto",
          },
        ]}
      >
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: theme.dark ? "#333333" : "#dbdbdb",
            marginTop: 5,
          }}
        >
          <Image
            source={require("@/assets/new-images/logo.png")}
            className="w-8 h-8"
          />
        </View>
        <View style={[messageStyles.messageContainer, { maxWidth: "80%" }]}>
          {isLoading ? (
            <LoaderKitView
              style={{ width: 22, height: 22, marginTop: 22 }}
              name={"BallPulse"}
              animationSpeedMultiplier={0.6}
              color={theme.dark ? "white" : "black"}
            />
          ) : (
            <>
              <Markdown
                style={{
                  ...markdownStyles,
                }}
              >
                {message}
              </Markdown>
              <View className="ml-2 flex flex-row items-center gap-3">
                <TouchableOpacity>
                  <Feather
                    name="copy"
                    size={15}
                    color={theme.dark ? "white" : "black"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    playing ? stopTts() : startTts(id, message);
                  }}
                >
                  {playing ? (
                    <FontAwesome5
                      name="pause-circle"
                      size={18}
                      color={theme.dark ? "white" : "black"}
                    />
                  ) : (
                    <Ionicons
                      name="volume-medium-outline"
                      size={20}
                      color={theme.dark ? "white" : "black"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    );
  },
);

export default ChatWindow;

const messageStyles = StyleSheet.create({
  messageContainer: {
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  messageText: {
    fontSize: 15.5,
    fontFamily: "Inter-Regular",
  },
});
