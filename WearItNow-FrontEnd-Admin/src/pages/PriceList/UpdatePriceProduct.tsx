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
import { ProductPrice } from "types/PriceList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store";
import { fetchProductsBySearch } from "store/Product/ProductAction";
import { debounce } from "lodash";

interface UpdatePriceListFormProps {
    id: number;
    priceListId: number;
    selectedPriceProduct: ProductPrice; 
    onUpdatePriceProduct: (updatedPriceProduct: ProductPrice, id: number, priceListId: number) => void;
    onCancel: () => void;
}

const UpdatePriceProductForm: React.FC<UpdatePriceListFormProps> = ({
    id,
    priceListId,
    selectedPriceProduct,
    onUpdatePriceProduct,
    onCancel,
}) => {
    const dispatch: AppDispatch = useDispatch();

    const { products, productPageSize, productCurrentPage } = useSelector((state: any) => state.productData);
    const [searchName, setSearchName] = useState<string>("");
    const { formData, errors, handleChange, validate } = useFormValidation({
        id: id || 0,
        productPriceId: priceListId,
        productId: selectedPriceProduct.productId || 0, 
        priceValue: selectedPriceProduct.priceValue || "", 
    });


    useEffect(() => {
        const fetchProducts = () => {
            dispatch(fetchProductsBySearch(searchParams));
        };
        const debouncedFetchProducts = debounce(fetchProducts, 500);
        debouncedFetchProducts();
        return () => {
            debouncedFetchProducts.cancel();
        };
    }, [dispatch, searchName, productCurrentPage, productPageSize]);

    const searchParams = {
        productName: searchName || "",
        size: productPageSize,
        page: productCurrentPage,
    };

    const handleFinish = () => {
        const labels = {
            productId: "Tên sản Phẩm",
            priceValue: "Giá trị",
        };

        const validationRules = [
            {
                field: "productId",
                value: formData.productId,
                rules: {
                    required: true,
                },
            },
            { field: "priceValue", value: formData.priceValue, rules: { required: true } },
        ];

        const newErrors = validate(validationRules, labels);
        if (Object.keys(newErrors).length === 0) {
            const updatedPriceProduct = {
                
                productPriceId: formData.productPriceId,
                productId: formData.productId,
                priceValue: parseFloat(formData.priceValue),
            };
            console.log("id productdata ",formData.productPriceId, formData.id)
            console.log("nút ",onUpdatePriceProduct(updatedPriceProduct, formData.productPriceId, formData.id))
            onUpdatePriceProduct(updatedPriceProduct, formData.productPriceId, formData.id); 
        }
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Grid container spacing={3}>
                <Grid item sx={{ visibility: "hidden", height: 0 }}>
                    <TextField
                        fullWidth
                        label="Product Price ID"
                        name="productPriceId"
                        value={formData.productPriceId}
                        onChange={handleChange("productPriceId")}
                        required
                        size="small"
                        error={!!errors.productId}
                        helperText={errors.productId}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Autocomplete
                        options={products || []}
                        getOptionLabel={(option: any) => option.name || ""}
                        value={
                            products?.find((product: any) => product.productId === formData.productId) || null
                        } // Hiển thị sản phẩm đã chọn
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
                        onInputChange={(_, value) => setSearchName(value)}
                        onChange={(_, value: any) => {
                            handleChange("productId")(value?.productId || 0);
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Price Value"
                        name="priceValue"
                        value={formData.priceValue}
                        onChange={handleChange("priceValue")}
                        required
                        size="small"
                        error={!!errors.priceValue}
                        helperText={errors.priceValue}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "secondary.main" }}
                            onClick={handleFinish}
                        >
                            Update
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

export default UpdatePriceProductForm;
