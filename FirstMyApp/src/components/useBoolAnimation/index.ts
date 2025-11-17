import { useEffect, useRef } from "react";
import { Animated } from "react-native";
export const useBoolAnimation = (val: boolean) => {
    const ref = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(ref, {
            toValue: val ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [val]);
    return (onFalse:any,onTrue:any) =>
        ref.interpolate({
            inputRange: [0, 1],
            outputRange: [onFalse,onTrue],
        });
}