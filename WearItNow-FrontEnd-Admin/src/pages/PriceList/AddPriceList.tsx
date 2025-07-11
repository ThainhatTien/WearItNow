import React  from "react";
import {
    Grid,
    Paper,
    Stack,
    TextField,
    Button,
} from "@mui/material";

import { useFormValidation } from "ValidateForm/useFormValidation";
import { PriceList } from "types/PriceList";

interface AddPriceListFormProps {
    onAddPriceList: (newPriceList: PriceList) => void;
    onCancel: () => void;
}

const AddPriceListForm: React.FC<AddPriceListFormProps> = ({ onAddPriceList, onCancel }) => {
    // const dispatch = useDispatch<AppDispatch>();
    const { formData, errors, handleChange, validate } = useFormValidation({
        code: "",
        name: "",
        startDate: "",
        endDate: ""
    });

    const handleFinish = () => {
        const labels = {
            code: "Mã bảng giá",
            name: "Tên bảng giá",
            startDate: "Ngày tạo",
            endDate: "Ngày hết hạn",
        };
        const validationRules = [
            { field: "code", value: formData.code, rules: { required: true, minLength: 3 } },
            { field: "name", value: formData.name, rules: { required: true } },
            { field: "startDate", value: formData.startDate, rules: { required: true } },
            { field: "endDate", value: formData.endDate, rules: { required: true } },
        ];
        const newErrors = validate(validationRules, labels);
        if (Object.keys(newErrors).length === 0) {
            // Tạo đối tượng PriceList từ formData
            const priceList: PriceList = {
                id: 0,
                code: formData.code,
                name: formData.name,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };
            onAddPriceList(priceList);
        }
    };
    

    return (
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange("code")}
                        required
                        size="small"
                        error={!!errors.code}
                        helperText={errors.code}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange("name")}
                        required
                        size="small"
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange("startDate")}
                        required
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange("endDate")}
                        required
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "secondary.main" }}
                            onClick={handleFinish}
                        >
                            Submit
                        </Button>
                        <Button variant="outlined" color="error" onClick={onCancel}>
                            Cancel
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AddPriceListForm;
