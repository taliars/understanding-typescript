// Validation
export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function validate(input: Validatable) {
    let isValid = true;

    const updateValidationWith = (addCheck: boolean) =>
        isValid = isValid && addCheck;

    if (input.required) {
        updateValidationWith(input.value.toString().trim().length !== 0);
    }

    if (input.minLength != null && typeof input.value === 'string') {
        updateValidationWith(input.value.length >= input.minLength);
    }

    if (input.maxLength != null && typeof input.value === 'string') {
        updateValidationWith(input.value.length <= input.maxLength);
    }

    if (input.min != null && typeof input.value === 'number') {
        updateValidationWith(input.value >= input.min);
    }

    if (input.max != null && typeof input.value === 'number') {
        updateValidationWith(input.value <= input.max);
    }

    return isValid;
}
