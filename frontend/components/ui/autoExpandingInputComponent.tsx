import { View } from "react-native";
import { SetStateAction, Dispatch } from "react";
import { StyleSheet } from "react-native";

export default function AutoExpandingInputComponent({
  height,
  setHeight,
  text,
  setText,
  isFocused,
  setIsFocused,
  positioning,
  styles,
}: {
  height: number;
  setHeight: Dispatch<SetStateAction<number>>;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  positioning: string;
  styles: string;
}) {
  return (
    <View className={`${positioning}`}>
      {/* <AutoGrowingTextInput
                onChangeText={(text: string) => {
                    setText(text)
                }}
                onContentSizeChange={(event: any) => {
                    setHeight(event.nativeEvent.contentSize.height)
                }}
                multiline={true}
                value={text}
                style={getInputStyles(height, isFocused).autoexpandinginput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Chat away"
                className={`rounded-lg ${styles}`}
            /> */}
    </View>
  );
}

const getInputStyles = (height: number, isFocused: boolean) => {
  const styles = StyleSheet.create({
    autoexpandinginput: {
      minHeight: 35,
      maxHeight: 210,
      height: Math.min(height, 210),
      padding: 8,
      borderWidth: 1,
      borderColor: isFocused ? "black" : "#ccc",
      textAlignVertical: "center",
    },
  });

  return styles;
};
