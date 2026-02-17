// COMMENTED OUT: This component uses Gluestack UI which has been removed
// import { Textarea, TextareaInput } from '@/components/ui/textarea'

export default function TextAreaComponent({
  inputValue,
  setInputValue,
  placeholder,
}: {
  inputValue: string | null;
  setInputValue: (para: string) => void;
  placeholder: string;
}) {
  return null;
  // return (
  //     <Textarea
  //         isReadOnly={false}
  //         isInvalid={false}
  //         isDisabled={false}
  //         className="px-1 rounded-lg h-48"
  //     >
  //         <TextareaInput
  //             placeholder={`${placeholder}`}
  //             style={{ textAlignVertical: 'top' }}
  //             className="text-[13px]"
  //             onChangeText={(text) => {
  //                 setInputValue(text)
  //             }}
  //         />
  //     </Textarea>
  // )
}
