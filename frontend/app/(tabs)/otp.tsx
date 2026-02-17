import { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useFocusEffect, useRouter } from "expo-router";
import useConfirm from "@/store/confirm";
import useTheme from "@/store/theme";
import { storeToken } from "@/utils/token";

function Input({
  disabled,
  setDigits,
}: {
  disabled: boolean;
  setDigits: (digits: string) => void;
}) {
  const { theme } = useTheme();
  return (
    <View className="w-full flex flex-row justify-between items-center gap-2">
      <OtpInput
        autoFocus={false}
        numberOfDigits={6}
        focusColor="#1DA1F2"
        onTextChange={(otp) => setDigits(otp)}
        disabled={disabled}
        theme={{
          pinCodeTextStyle: {
            ...inputStyles.pinCodeTextStyle,
            color: theme === "dark" ? "white" : "black",
          },
        }}
      />
    </View>
  );
}

const inputStyles = StyleSheet.create({
  pinCodeTextStyle: {
    fontSize: 24,
    fontWeight: "400",
  },
});

function Otp() {
  const { confirm } = useConfirm();
  const router = useRouter();

  const [digits, setDigits] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => {
    return digits.length !== 6;
  }, [digits]);

  useEffect(() => {
    if (digits.length === 6) {
      Keyboard.dismiss();
    }
  }, [digits]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setLoading(false);
        setDigits("");
      };
    }, []),
  );

  const handleOtpSubmit = async () => {
    try {
      if (!confirm) {
        throw new Error("Confirmation not found");
      }
      setLoading(true);
      const userCredential = await confirm.confirm(digits);
      if (!userCredential) {
        throw new Error("User credential not found");
      }
      const result = await storeToken(userCredential.user.uid);
      if (result === 0) {
        throw new Error("Failed to store token");
      }
      router.navigate("/(drawer)");
    } catch (e: any) {
      console.log(e);
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          className={`flex-1 w-[90%] flex flex-col relative ${Platform.OS === "ios" ? "pt-10 pb-20" : "pt-20 pb-40"}`}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/new-images/logo.png")}
              className="w-52 h-52"
            />
          </View>
          <Input disabled={loading} setDigits={setDigits} />
          <View className="w-full" style={styles.bottomContainer}>
            <TouchableOpacity
              onPress={() => handleOtpSubmit()}
              style={[
                styles.button,
                {
                  backgroundColor: loading || disabled ? "gray" : "#1DA1F2",
                },
              ]}
              className="flex flex-row items-center justify-center gap-6"
              disabled={loading || disabled}
            >
              <Text style={[styles.buttonText]}>
                {!loading ? (
                  <Text style={[styles.buttonText]}>Continue</Text>
                ) : (
                  <ActivityIndicator size="small" color="#fff" />
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginHorizontal: "auto",
    marginBottom: 40,
  },
  button: {
    width: "100%",
    backgroundColor: "#1DA1F2",
    paddingVertical: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: "auto",
  },
});
