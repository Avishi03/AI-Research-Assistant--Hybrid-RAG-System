// COMMENTED OUT: This component uses Gluestack UI which has been removed
// import {
//     Select,
//     SelectTrigger,
//     SelectInput,
//     SelectIcon,
//     SelectPortal,
//     SelectBackdrop,
//     SelectContent,
//     SelectDragIndicator,
//     SelectDragIndicatorWrapper,
//     SelectItem,
// } from '@/components/ui/select'
// import { ChevronDownIcon } from '@/components/ui/icon'
import { ScrollView, Dimensions } from "react-native";
import { StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export default function DropDownComponent({
  type,
  inputValue,
  setInputValue,
}: {
  type: string;
  inputValue: string | null;
  setInputValue: (para: string) => void;
}) {
  return null;
  // return (
  //     <>
  //         <Select
  //             className=""
  //             selectedValue={inputValue}
  //             onValueChange={(value) => {
  //                 setInputValue(value)
  //             }}
  //         >
  //             <SelectTrigger
  //                 className="flex flex-row justify-between"
  //                 variant="outline"
  //                 size="lg"
  //             >
  //                 <SelectInput
  //                     className="text-sm"
  //                     placeholder="Select Option"
  //                 />
  //                 <SelectIcon className="mr-3" as={ChevronDownIcon} />
  //             </SelectTrigger>
  //             <SelectPortal className="">
  //                 <SelectBackdrop />
  //                 <SelectContent className={`pt-2 text-left`}>
  //                     <SelectDragIndicatorWrapper>
  //                         <SelectDragIndicator />
  //                     </SelectDragIndicatorWrapper>
  //                     {DropDownItems(type)}
  //                 </SelectContent>
  //             </SelectPortal>
  //         </Select>
  //     </>
  // )
}

function DropDownItems(type: string) {
  let iterable: number[] = [];
  if (type === "height") {
    iterable = [...Array(301).keys()];
  } else if (type === "age") {
    iterable = [...Array(101).keys()];
  } else if (type === "weight") {
    iterable = [...Array(201).keys()];
  }

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {iterable.map((item: number, index) => {
          return getDropDownItem(item, index);
        })}
      </ScrollView>
    </>
  );
}

// function getDropDownItem(value: number, index: number) {
//     return (
//         <SelectItem
//             className="px-4"
//             key={index}
//             label={`${value}`}
//             value={`${value}`}
//         />
//     )
// }

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 300,
    width: width,
    paddingBottom: 20,
    marginBottom: 20,
  },
});
