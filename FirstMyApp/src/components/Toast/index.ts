import { MessageType, showMessage } from "react-native-flash-message";

interface ToastArguments {
    message: string; 
    type: MessageType
}

export const showToast = (data: ToastArguments) => {
    showMessage(data)
}