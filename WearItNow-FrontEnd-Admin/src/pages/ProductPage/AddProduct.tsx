import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Grid,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { UploadOutlined } from "@mui/icons-material";
import { Upload } from "antd";
import { fetchCategories } from "store/Category/CategotiesAction";
import { AppDispatch } from "store";
import { CategoryWithId } from "types/CategoryType";
import { useFormValidation } from "ValidateForm/useFormValidation";
import Splash from "components/loading/Splash";

interface AddProductFormProps {
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit, onCancel }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, categories, categoryCurrentPage, categoryPageSize } = useSelector((state: any) => state.categoryData);
    const {
        formData,
        errors,
        handleChange,
        validate,
        setFieldValue,
    } = useFormValidation({
        name: "",
        price: "",
        categoryId: "",
        description: "",
        image: null,
        additionalImages: [],
    });
    const search ={
        page: categoryCurrentPage,
        size: categoryPageSize
      }
    useEffect(() => {
        dispatch(fetchCategories(search));
    }, [dispatch]);
   
    const handleFinish = () => {
        const labels = {
            name: "Tên sản phẩm",
            price: "Giá",
            categoryId: "Danh mục",
            description: "Mô tả",
        };
        const validationRules = [
            { field: "name", value: formData.name, rules: { required: true, minLength: 3 } },
            { field: "price", value: formData.price, rules: { required: true, isNumber: true, min: 10000 } },
            { field: "categoryId", value: formData.categoryId, rules: { required: true } },
            { field: "description", value: formData.description, rules: { required: true, minLength: 10 } },
        ];
        const newErrors = validate(validationRules, labels); // Truyền labels vào validate
        // const newErrors = validate(validationRules);

        if (Object.keys(newErrors).length === 0) {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("price", formData.price);
            formDataToSubmit.append("categoryId", formData.categoryId);
            formDataToSubmit.append("description", formData.description);

            if (formData.image) {
                formDataToSubmit.append("image", formData.image);
            }

            formData.additionalImages.forEach((file: File) => {
                formDataToSubmit.append("additionalImages", file);
            });

            onSubmit(formDataToSubmit);
        }
    };

    const handleImageChange = (file: File) => {
        setFieldValue("image", file);
    };

    const handleAdditionalImagesChange = (files: File[]) => {
        setFieldValue("additionalImages", [...formData.additionalImages, ...files]);
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 2 }}>
            {loading && <Splash />}
            {error && (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            )}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Tên sản phẩm"
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
                        label="Giá"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange("price")}
                        required
                        size="small"
                        error={!!errors.price}
                        helperText={errors.price}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        fullWidth
                        label="Danh mục"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleChange("categoryId")}
                        required
                        size="small"
                        SelectProps={{
                            displayEmpty: true,
                        }}
                        error={!!errors.categoryId}
                        helperText={errors.categoryId}
                    >
                        <MenuItem value="" disabled>
                            Chọn danh mục...
                        </MenuItem>
                        {categories.map((category: CategoryWithId) => (
                            <MenuItem key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Mô tả"
                        name="description"
                        multiline
                        rows={3}
                        value={formData.description}
                        onChange={handleChange("description")}
                        required
                        size="small"
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Hình ảnh chính</Typography>
                    <Upload
                        maxCount={1}
                        showUploadList={false}
                        beforeUpload={(file: any) => {
                            handleImageChange(file);
                            return false;
                        }}
                    >
                        <Button variant="outlined" startIcon={<UploadOutlined />} size="small">
                            Chọn hình ảnh chính
                        </Button>
                    </Upload>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="body1">Hình ảnh phụ</Typography>
                    <Upload
                        multiple
                        maxCount={5}
                        beforeUpload={(file: any) => {
                            handleAdditionalImagesChange([file]);
                            return false;
                        }}
                    >
                        <Button variant="outlined" startIcon={<UploadOutlined />} size="small">
                            Chọn hình ảnh phụ
                        </Button>
                    </Upload>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "secondary.main" }}
                            onClick={handleFinish}
                        >
                            Thêm sản phẩm
                        </Button>
                        <Button variant="outlined" color="error" onClick={onCancel}>
                            Hủy bỏ
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default AddProductForm;
