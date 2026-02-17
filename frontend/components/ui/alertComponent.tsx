// COMMENTED OUT: This component uses Gluestack UI which has been removed
// import { Alert, AlertText, AlertIcon } from '@/components/ui/alert'
// import { InfoIcon } from '@/components/ui/icon'
import { View } from "react-native";

export default function AlertComponent({
  alertMsg,
  positioning,
}: {
  alertMsg: string;
  positioning?: string;
}) {
  return null;
  // return (
  //     <View
  //         className={`absolute top-0 w-screen flex flex-row justify-center ${positioning}`}
  //     >
  //         <Alert
  //             action="muted"
  //             variant="solid"
  //             className="bg-red-600 w-full px-4 rounded-none"
  //         >
  //             <View className="flex flex-row justify-center items-center py-1">
  //                 <AlertIcon
  //                     as={InfoIcon}
  //                     size="md"
  //                     className="text-white mr-3"
  //                 />
  //                 <AlertText className="text-white text-lg">
  //                     {alertMsg}
  //                 </AlertText>
  //             </View>
  //         </Alert>
  //     </View>
  // )
}
