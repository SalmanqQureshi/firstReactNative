import { Ref, useImperativeHandle, useState } from "react";

type FormComponentRef<T> = {
    focus(): any,
    getValue(arg: { [key: string]: string }): T | false
}
type ErrorTextType = (string | false)[]
interface FormComponentState<T> {
    isFocused: boolean,
    value: T,
    isError: boolean,
    ErrorText: ErrorTextType,
}
interface useFormArguments<T> {
    upRef: Ref<FormComponentRef<T>>,
    focus(): void,
    validate(current: T, form: { [key: string]: string }): ErrorTextType
    initialValue: T,
}

export function useForm<T>(
    { upRef, focus, validate, initialValue }: useFormArguments<T>
) {
    const [State, setState] = useState<FormComponentState<T>>({
        isFocused: !!initialValue?.length,
        value: initialValue,
        isError: false,
        ErrorText: [],
    });
    useImperativeHandle(upRef, () => ({
        focus,
        getValue(form) {
            const errors = validate(State.value, form);
            if (!!errors && !errors.length) {
                return State.value;
            } else {
                setState(s => ({
                    ...s,
                    isError: true,
                    ErrorText: errors,
                }));
                return false;
            }
        }
    }), [State]);
    return { State, setState }
};
