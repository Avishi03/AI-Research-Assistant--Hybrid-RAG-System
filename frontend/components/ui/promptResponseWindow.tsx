import { View, Text, ScrollView, Animated } from "react-native";
import { useRef, useEffect } from "react";
import { Fragment } from "react";

import LLMLogo from "../chat/llmLogo";

export default function PromptResponseWindow({ chat }: { chat: any }) {
  const scrollViewRef = useRef<ScrollView>(null);

  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [chat]);

  return (
    <ScrollView ref={scrollViewRef}>
      <View className="bg-white w-screen h-full">
        <View className="flex flex-col items-start bg-white py-2">
          {getTextArray(chat).map((message, index) => (
            <Fragment key={message.id}>
              <View className="bg-blue-200 px-4 py-2 rounded-xl max-w-[75%] self-end mr-5 my-4">
                <Text>{message.prompt}</Text>
              </View>
              <View className="flex flex-row items-start mb-2 w-full mx-4">
                <LLMLogo modelName={message.responseGeneratedBy} />
                <View
                  className={`max-w-[75%] pt-2 ${(message.responseGeneratedBy === "Llama" || message.responseGeneratedBy === "BioGPT") && index === getTextArray(chat).length - 1 ? "mb-2" : ""}`}
                  pointerEvents="box-none"
                >
                  {message.response === "" ? (
                    <Animated.Text style={{ fontSize: 14, opacity }}>
                      Analyzing...
                    </Animated.Text>
                  ) : (
                    <Text>{message.response}</Text>
                  )}
                </View>
              </View>
            </Fragment>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const getTextArray = (chat: any) => {
  if (!chat || chat.length === 0 || !chat[0].prompts || !chat[0].responses) {
    return [];
  }

  let i = chat[0].prompts.length;
  const messages = [];
  for (let j = 1; j <= chat[0].prompts.length; j += 1) {
    const message = {
      id: j,
      prompt: chat[0].prompts[j - 1].text,
      response: chat[0].responses[j - 1].text,
      responseGeneratedBy: chat[0].responses[j - 1].generatedBy,
    };
    messages.push(message);
  }
  return messages;
};
