import { useEffect, useState, useRef } from 'react';
export function useDebounceBase(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}
export function useDebouncedState(
    initialValue = '',
    delay = 500,
    onChange: undefined | ((value: string) => any),
) {
    const [Value, setValue] = useState(initialValue);
    console.log({ Value });

    const DebouncedValue = useDebounceBase(Value, delay);
    if (!!onChange) {
        useEffect(() => {
            onChange(DebouncedValue);
        }, [DebouncedValue]);
    }
    return [DebouncedValue, Value, setValue];
}
export const useDebouncedFunction = () => {
    const BOUNCE_RATE = 2000;

    const busy = useRef(false);

    const debounce = async (callback: Function) => {
        setTimeout(() => {
            busy.current = false;
        }, BOUNCE_RATE);

        if (!busy.current) {
            busy.current = true;
            callback();
        }
    };

    return { debounce };
};