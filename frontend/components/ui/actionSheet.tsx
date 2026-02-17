// COMMENTED OUT: This component uses Gluestack UI which has been removed
// import { useState } from 'react'
// import {
//     Actionsheet,
//     ActionsheetContent,
//     ActionsheetItem,
//     ActionsheetItemText,
//     ActionsheetDragIndicator,
//     ActionsheetDragIndicatorWrapper,
//     ActionsheetBackdrop,
// } from '@/components/ui/actionsheet'
// import { Button, ButtonText } from '@/components/ui/button'

// function ActionSheetComponent() {
//     const [showActionsheet, setShowActionsheet] = useState(false)
//     const handleClose = () => setShowActionsheet(false)

//     return (
//         <>
//             <Button className="w-20" onPress={() => setShowActionsheet(true)}>
//                 <ButtonText>Open Actionsheet</ButtonText>
//             </Button>
//             <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
//                 <ActionsheetBackdrop />
//                 <ActionsheetContent>
//                     <ActionsheetDragIndicatorWrapper>
//                         <ActionsheetDragIndicator />
//                     </ActionsheetDragIndicatorWrapper>
//                     <ActionsheetItem onPress={handleClose}>
//                         <ActionsheetItemText>Edit Message</ActionsheetItemText>
//                     </ActionsheetItem>
//                     <ActionsheetItem onPress={handleClose}>
//                         <ActionsheetItemText>Mark Unread</ActionsheetItemText>
//                     </ActionsheetItem>
//                     <ActionsheetItem onPress={handleClose}>
//                         <ActionsheetItemText>Remind Me</ActionsheetItemText>
//                     </ActionsheetItem>
//                     <ActionsheetItem onPress={handleClose}>
//                         <ActionsheetItemText>
//                             Add to Saved Items
//                         </ActionsheetItemText>
//                     </ActionsheetItem>
//                     <ActionsheetItem isDisabled onPress={handleClose}>
//                         <ActionsheetItemText>Delete</ActionsheetItemText>
//                     </ActionsheetItem>
//                 </ActionsheetContent>
//             </Actionsheet>
//         </>
//     )
// }

// export default ActionSheetComponent

// Placeholder component to prevent import errors
export default function ActionSheetComponent() {
  return null;
}
