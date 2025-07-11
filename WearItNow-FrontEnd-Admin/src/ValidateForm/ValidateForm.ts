interface ValidationRule {
    field: string;
    value: string | number | null ;
    rules: {
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: RegExp;
        custom?: (value: any) => string | null;
    };
}

export const validateForm = (fields: ValidationRule[], labels: Record<string, string>) => {
    const errors: Record<string, string> = {};
    
    fields.forEach(({ field, value, rules }) => {
        const label = labels[field] || field; // Sử dụng tên hiển thị từ `labels` nếu có, nếu không dùng tên field gốc
        if (rules.required && (!value || value.toString().trim() === "")) {
            errors[field] = `${label} không được để trống!`;
        }
        if (rules.minLength && value && value.toString().length < rules.minLength) {
            errors[field] = `${label} phải có ít nhất ${rules.minLength} ký tự!`;
        }
        if (rules.maxLength && value && value.toString().length > rules.maxLength) {
            errors[field] = `${label} không được vượt quá ${rules.maxLength} ký tự!`;
        }
        if (rules.min !== undefined && value && Number(value) < rules.min) {
            errors[field] = `${label} phải lớn hơn hoặc bằng ${rules.min}!`;
        }
        if (rules.max !== undefined && value && Number(value) > rules.max) {
            errors[field] = `${label} phải nhỏ hơn hoặc bằng ${rules.max}!`;
        }
        if (rules.pattern && value && !rules.pattern.test(value.toString())) {
            errors[field] = `${label} không hợp lệ!`;
        }
        if (rules.custom) {
            const customError = rules.custom(value);
            if (customError) {
                errors[field] = customError;
            }
        }
        if (field === 'dob' && value) {
            const today = new Date();
            const birthDate = new Date(value);
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (age < 10 || (age === 10 && monthDifference < 0)) {
                errors[field] = `${label} phải lớn hơn hoặc bằng 10 tuổi!`;
            }
        }
    });

    return errors;
};
