// COMMENTED OUT: This component uses Gluestack UI which has been removed
// import {
//     Select,
//     SelectTrigger,
//     SelectInput,
//     SelectIcon,
//     SelectPortal,
//     SelectBackdrop,
//     SelectContent,
//     SelectDragIndicatorWrapper,
//     SelectDragIndicator,
//     SelectItem,
// } from '@/components/ui/select'
// import { ChevronDownIcon } from './ui/icon'

export default function SelectOptionComponent({
  styles,
  inputValue,
  setInputValue,
}: {
  inputValue: string | null;
  setInputValue: (para: string) => void;
  styles?: string;
}) {
  return null;
  // return (
  //     <Select
  //         className={`${styles}`}
  //         selectedValue={inputValue}
  //         onValueChange={(value) => {
  //             setInputValue(value)
  //         }}
  //     >
  //         <SelectTrigger
  //             variant="outline"
  //             size="lg"
  //             className="flex flex-row justify-between"
  //         >
  //             <SelectInput className="text-sm" placeholder="Select option" />
  //             <SelectIcon className="mr-3" as={ChevronDownIcon} />
  //         </SelectTrigger>
  //         <SelectPortal className="">
  //             <SelectBackdrop />
  //             <SelectContent className={`pt-2 pb-10`}>
  //                 <SelectDragIndicatorWrapper>
  //                     <SelectDragIndicator />
  //                 </SelectDragIndicatorWrapper>
  //                 <SelectItem className="pt-3" label="Male" value="male" />
  //                 <SelectItem label="Female" value="female" />
  //                 <SelectItem label="Rather Not Say" value="NA" />
  //             </SelectContent>
  //         </SelectPortal>
  //     </Select>
  // )
}
