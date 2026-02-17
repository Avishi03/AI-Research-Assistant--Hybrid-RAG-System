import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useRef, useEffect } from "react";

const data = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export default function Test() {
  const [active, setActive] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: active,
      animated: true,
    });
  }, [active]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <View className="flex flex-col">
        <FlatList
          ref={flatListRef}
          data={data}
          renderItem={({ item }) => (
            <View style={{ width: 100, height: 100, backgroundColor: "green" }}>
              <Text>{item}</Text>
            </View>
          )}
          getItemLayout={(data, index) => {
            return { length: 100, index, offset: 100 * index };
          }}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          style={{
            backgroundColor: "blue",
          }}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <TouchableOpacity
            className="bg-blue-500 p-2 rounded-md"
            onPress={() =>
              setActive((prevState) => {
                return prevState > 0 ? prevState - 1 : 0;
              })
            }
          >
            <Text>Previous</Text>
          </TouchableOpacity>
          <Text className="text-white">{active}</Text>
          <TouchableOpacity
            className="bg-blue-500 p-2 rounded-md"
            onPress={() =>
              setActive((prevState) => {
                return prevState < 25 ? prevState + 1 : 25;
              })
            }
          >
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
