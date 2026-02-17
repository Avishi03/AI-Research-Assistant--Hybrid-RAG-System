import { View } from "react-native";
import Modal from "react-native-modal";

import LogoutButton from "./logout";
import PageChangeTabs from "../sidebar/pageChangeTabs";

export default function SideBarComponent({
  showSideBar,
  setShowSideBar,
  activePage,
}: {
  showSideBar: boolean;
  setShowSideBar: (para: boolean) => void;
  activePage: string;
}) {
  return (
    <Modal
      style={{ margin: 0, width: "70%" }}
      isVisible={showSideBar}
      onBackdropPress={() => setShowSideBar(false)}
      swipeDirection="left"
      animationIn={"slideInLeft"}
      animationOut={"slideOutLeft"}
    >
      <View className="bg-white flex flex-col left-0 h-screen fixed top-0 bottom-0">
        <View className="z-10 mt-32 mx-3">
          <PageChangeTabs activePage={activePage} />
        </View>
        <View className="absolute bottom-20 w-full flex flex-row justify-center">
          <LogoutButton
            buttonStyles="py-3 px-10 rounded-lg w-full bg-white border-[1px]"
            textStyles="text-base text-black"
          />
        </View>
      </View>
    </Modal>
  );
}
