import { View } from "react-native";
import { useState } from "react";
// COMMENTED OUT: These components use Gluestack UI which has been removed
// import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input'
// import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icon'

export default function InputComponent({
  type,
  styles,
  placeholder,
  setValue,
  isInvalid,
}: {
  type: string;
  styles: string;
  placeholder: string;
  setValue: (parameter: string) => void;
  isInvalid: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return null;
  // return (
  //     <View>
  //         <Input
  //             variant="outline"
  //             size="md"
  //             isDisabled={false}
  //             isInvalid={isInvalid}
  //             isReadOnly={false}
  //             className={`py-2 border-none ${styles}`}
  //         >
  //             {getInputIcon(type)}
  //             <InputField
  //                 type={`${type === 'password' && !showPassword ? 'password' : 'text'}`}
  //                 keyboardType={`${type === 'email' ? 'email-address' : 'default'}`}
  //                 placeholder={placeholder}
  //                 onChangeText={(text) => {
  //                     setValue(text)
  //                 }}
  //                 autoCapitalize="none"
  //             />
  //             {getShowPasswordIcon()}
  //         </Input>
  //     </View>
  // )

  // function handleShowPasswordState() {
  // 	setShowPassword((prevState) => !prevState)
  // }
  // function getShowPasswordIcon() {
  // 	if (type === 'password') {
  // 		return (
  // 			<InputSlot className="pr-6" onPress={handleShowPasswordState}>
  // 				<InputIcon as={!showPassword ? EyeOffIcon : EyeIcon} />
  // 			</InputSlot>
  // 		)
  // 	}
  // }
}

// function getInputIcon(type: string) {
// 	let icon;
// 	if (type === 'password') {
// 		icon = LockIcon
// 	} else if (type === 'email') {
// 		icon = MailIcon
// 	}
// 	return (
// 		<InputSlot className="pl-4">
// 			<InputIcon as={icon} />
// 		</InputSlot>
// 	)
// }
