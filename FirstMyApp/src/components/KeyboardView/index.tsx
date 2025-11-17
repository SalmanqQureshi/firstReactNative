import React, { ReactNode, useEffect, useState } from 'react';
import { View, StyleSheet, Keyboard, KeyboardAvoidingView, ViewStyle, Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
 
 
interface Props {
    children: ReactNode;
    style?: ViewStyle;
}
 
export const KeyboardView: React.FC<Props> = ({ children, style }) => {
    const [isKeyboardHeight, setIsKeyboardHeight] = useState(0);
 
    useEffect(() => {
        if (Platform.OS === 'ios') {
            KeyboardManager.setEnable(false);
            KeyboardManager.setEnableAutoToolbar(false);
        }
        return () => {
            if (Platform.OS === 'ios') {
                KeyboardManager.setEnable(true);
                KeyboardManager.setEnableAutoToolbar(true);
                KeyboardManager.setShouldResignOnTouchOutside(false);
            }
 
        };
    }, []);
 
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardWillShow',
            (height) => {
                setIsKeyboardHeight(height.endCoordinates.height);
            }
        );
 
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardWillHide',
            () => {
                setIsKeyboardHeight(0);
            }
        );
 
        // Clean up listeners
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
 
    return (
        <View style={{ ...styles.container, ...style, paddingBottom: !!isKeyboardHeight ? isKeyboardHeight : 12 }}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                {children}
            </KeyboardAvoidingView>
        </View>
    );
};
 
 
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})