import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Stack,
    TextField,
    Button,
    Autocomplete,
} from "@mui/material";

import { useFormValidation } from "ValidateForm/useFormValidation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store";
import { fetchProductsBySearch } from "store/Product/ProductAction";
import { debounce } from "lodash";
import { SaleProduct } from "types/SaleProduct";

interface AddSaleProductProps {
    onAddSaleProduct: (newSaleProduct: SaleProduct,) => void;
    onCancel: () => void;
}

const AddSaleProduct: React.FC<AddSaleProductProps> = ({ onAddSaleProduct, onCancel }) => {
    const dispatch: AppDispatch = useDispatch();

    const { products, productPageSize, productCurrentPage } = useSelector((state: any) => state.productData);
    const [searchName, setSearchName] = useState<string>("");
    const { formData, errors, handleChange, validate } = useFormValidation({
        productId: 0,
        saleProductId: 0,
        discountRate: 0,
        startDate: '',
        endDate: '',
    });
    useEffect(() => {
        const fetchProducts = () => {
            dispatch(fetchProductsBySearch(searchParams));
        };
        // Sử dụng debounce cho hàm fetch
        const debouncedFetchProducts = debounce(fetchProducts, 500);
        debouncedFetchProducts();
        return () => {
            debouncedFetchProducts.cancel();
        };
    }, [dispatch, searchName, productCurrentPage, productPageSize,]);

    const searchParams = {
        productName: searchName || "",
        size: productPageSize,
        page: productCurrentPage
    }

    const handleFinish = () => {
        const labels = {
            discountRate: 'Giảm giá (%)',
            startDate: 'Ngày bắt đầu',
            endDate: 'Ngày kết thúc',
        };

        const validationRules = [
            { field: 'discountRate', value: formData.discountRate, rules: { required: true, min: 0, max: 100 } },
            { field: 'startDate', value: formData.startDate, rules: { required: true } },
            { field: 'endDate', value: formData.endDate, rules: { required: true } },
        ];

        const newErrors = validate(validationRules, labels);

        if (Object.keys(newErrors).length === 0) {

            onAddSaleProduct(formData);
        }
    };


    return (
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Autocomplete
                        options={products || []}
                        getOptionLabel={(option: any) => option.name || ""} // Hiển thị tên sản phẩm
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Product"
                                required
                                size="small"
                                error={!!errors.productId}
                                helperText={errors.productId}
                            />
                        )}
                        onInputChange={(_, value) => setSearchName(value)} // Lọc theo tên
                        onChange={(_, value: any) => {
                            if (value) {
                                // Cập nhật productId khi sản phẩm được chọn
                                handleChange("productId")(value.productId);
                            } else {
                                // Xóa productId nếu không có sản phẩm được chọn
                                handleChange("productId")(0);
                            }
                        }}
                    />

                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Giảm giá (%)"
                        type="number"
                        name="discountRate"
                        value={formData.discountRate || ''}
                        onChange={handleChange('discountRate')}
                        fullWidth
                        margin="normal"
                        error={!!errors.discountRate}
                        helperText={errors.discountRate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Ngày bắt đầu"
                        type="date"
                        name="startDate"
                        value={formData.startDate || ''}
                        onChange={handleChange('startDate')}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={!!errors.startDate}
                        helperText={errors.startDate}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Ngày kết thúc"
                        type="date"
                        name="endDate"
                        value={formData.endDate || ''}
                        onChange={handleChange('endDate')}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
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

export default AddSaleProduct;
