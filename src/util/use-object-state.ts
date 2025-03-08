import { useState } from "preact/hooks";

export function useObjectState<T>(
	defaultValue: T,
): [T, (value: Partial<T>) => void] {
	const [value, setStateValue] = useState<T>(defaultValue);
	const setValue = (newValue: Partial<T>) => {
		setStateValue((currentValue) => ({ ...currentValue, ...newValue }));
	};

	return [value, setValue];
}
