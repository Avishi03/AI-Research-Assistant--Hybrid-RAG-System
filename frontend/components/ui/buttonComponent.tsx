import { View } from "react-native";

// COMMENTED OUT: This component uses Gluestack UI which has been removed
// import { Button, ButtonText } from '@/components/ui/button'

export default function ButtonComponent({
  msg,
  buttonStyles,
  textStyles,
  onclick,
  isDisabled,
}: {
  msg: string;
  buttonStyles?: string;
  textStyles?: string;
  onclick: () => void;
  isDisabled?: boolean;
}) {
  return null;
  // return (
  //     <View>
  //         <Button
  //             size="md"
  //             variant="solid"
  //             action="primary"
  //             className={`${buttonStyles} ${isDisabled ? 'opacity-60' : ''}`}
  //             onPress={onclick}
  //             disabled={isDisabled}
  //         >
  //             <ButtonText className={`${textStyles}`}>{msg}</ButtonText>
  //         </Button>
  //     </View>
  // )
}
