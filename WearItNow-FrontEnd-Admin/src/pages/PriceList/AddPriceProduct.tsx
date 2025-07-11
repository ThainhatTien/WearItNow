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

interface AddPriceListFormProps {
    priceListId: number;
    onAddPriceProduct: (newPriceProduct: ProductPrice[], id: number) => void;
    onCancel: () => void;
}

const AddPriceProductForm: React.FC<AddPriceListFormProps> = ({ onAddPriceProduct, onCancel, priceListId }) => {
    const dispatch: AppDispatch = useDispatch();

    const { products, productPageSize, productCurrentPage } = useSelector((state: any) => state.productData);
    const [searchName, setSearchName] = useState<string>("");
    const { formData, errors, handleChange, validate } = useFormValidation({
        productPriceId: priceListId, 
        productId: 0,        
        priceValue: ""       
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
    }, [dispatch,searchName ,productCurrentPage, productPageSize,]);

    const searchParams = {
        productName: searchName || "",
        size: productPageSize,
        page: productCurrentPage
    }

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
                    isArray: true, 
                    notEmpty: true, 
                    isValidArrayItem: (value: any) => value.every((id: any) => typeof id === "number" || typeof id === "string"), 
                },
            },
            { field: "priceValue", value: formData.priceValue, rules: { required: true } },
        ];
    
        const newErrors = validate(validationRules, labels);
        if (Object.keys(newErrors).length === 0) {
            // Duyệt qua các productId và tạo mảng các đối tượng PriceProduct
            const priceProductList = (formData.productId || [])
                .map((productId: any) => ({
                    productPriceId: formData.productPriceId,  
                    productId: productId,                     
                    priceValue: parseFloat(formData.priceValue),  
                }))
                // Loại bỏ các productId trùng lặp
                .filter((value:any, index:any, self:any) => 
                    index === self.findIndex((t:any) => (
                        t.productId === value.productId
                    ))
                );
    
            // Kết hợp các đối tượng cũ và mới vào mảng priceList
            const updatedPriceList = [...(formData.priceList || []), ...priceProductList];
            onAddPriceProduct(updatedPriceList, formData.productPriceId);  // Gửi mảng mới cho API
        }
    };
    

    return (
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            <Grid container spacing={3}>
            <Grid item sx={{visibility: "hidden", height: 0 }}>
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
                        multiple
                        options={products || []}
                        getOptionLabel={(option: any) => option.name || ""}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Product ID"
                                required
                                size="small"
                                error={!!errors.productId}
                                helperText={errors.productId}
                            />
                        )}
                        onInputChange={(_, value) => setSearchName(value)}
                        onChange={(_, value: any) =>{
                            handleChange("productId")(value?.map((item: any) => item.productId) || []);
                        }
                        }
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

export default AddPriceProductForm;
