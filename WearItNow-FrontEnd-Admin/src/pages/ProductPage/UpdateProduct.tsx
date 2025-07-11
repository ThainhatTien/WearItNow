import React, { useState, useEffect } from "react";
import { Button, FormControl, InputLabel, MenuItem, TextField, Grid, Paper, Typography, Stack, IconButton, InputAdornment } from "@mui/material";
import { Close, UploadFileOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "store";
import { fetchCategories } from "store/Category/CategotiesAction";
import { message } from "antd";
import { Product, ProductImage } from "../../types/ProductTypes";
import { useFormValidation } from "ValidateForm/useFormValidation";
import { CategoryWithId } from "types/CategoryType";

interface EditProductFormProps {
    product: Product;
    productId: number;
    onUpdate: (productId: number, formData: FormData) => void;
    onCancel: () => void;
}

const UpdateProduct: React.FC<EditProductFormProps> = ({ product, onUpdate, onCancel }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { categories, categoryCurrentPage, categoryPageSize } = useSelector((state: any) => state.categoryData);

    const initialFormData = {
        name: product.name ?? "",
        price: product.price,
        description: product.description ?? "",
        categoryId: product.category?.categoryId ?? "",
    };

    const { formData, errors, handleChange, validate, handleSelectChange } = useFormValidation(initialFormData);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [additionalImages, setAdditionalImages] = useState<ProductImage[]>(product?.images || []);
    const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        dispatch(fetchCategories(search));
        if (product.image) {
            setImagePreview(product.image);
        }
        if (product.images) {
            setAdditionalImages(product.images);
            const previews = product.images.map(image => image.imageUrl);
            setAdditionalImagePreviews(previews);
        }
        
    }, [product, dispatch]);
    const search ={
        page: categoryCurrentPage,
        size: categoryPageSize
      }
    useEffect(() => {
        return () => {
            additionalImagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [additionalImagePreviews]);

    const handleSave = () => {
        const labels = {
            name: "Tên sản phẩm",
            price: "Giá",
            categoryId: "Danh mục",
            description: "Mô tả",
        };

        const validationRules = [
            { field: "name", value: formData.name, rules: { required: true } },
            { field: "price", value: formData.price, rules: { required: true, isNumber: true, min: 1 } },
            { field: "categoryId", value: formData.categoryId, rules: { required: true } },
            // { field: "description", value: formData.description, rules: { required: true, minLength: 10 } },
        ];

        const validationResult = validate(validationRules, labels);

        if (validationResult && typeof validationResult === 'object' && Object.keys(validationResult).length > 0) {
            message.error("Vui lòng sửa lỗi trong biểu mẫu.");
            return;
        }
        
        
        

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("price", formData.price.toString());
        formDataToSend.append("description", formData.description);
        formDataToSend.append("isActive", formData.isActive ? "true" : "false");
        formDataToSend.append("categoryId", formData.categoryId.toString());

        // Thêm hình ảnh chính
        if (imageFile) {
            formDataToSend.append("image", imageFile);
        }

        // Thêm các hình ảnh phụ
        additionalImageFiles.forEach((file, index) => {
            formDataToSend.append(`additionalImages[${index}]`, file);
        });

        onUpdate(product.productId, formDataToSend);
    };

    const handleImageUpload = (file: File, isMainImage: boolean) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (isMainImage) {
                setImageFile(file);
                setImagePreview(reader.result as string);
            } else {
                setAdditionalImageFiles((prevFiles) => [...prevFiles, file]);
                const newImage: ProductImage = { imageId: 0, imageUrl: URL.createObjectURL(file) };
                setAdditionalImages((prevImages) => [...prevImages, newImage]);
                setAdditionalImagePreviews((prevPreviews) => [...prevPreviews, reader.result as string]);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3, }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Cập nhật sản phẩm
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        label="Tên sản phẩm"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={formData.name}
                        onChange={handleChange("name")}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Giá sản phẩm"
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={formData.price}
                        onChange={handleChange("price")}
                        type="number"
                        error={!!errors.price}
                        helperText={errors.price}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">VND</InputAdornment>,
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        label="Danh mục"
                        fullWidth
                        value={formData.categoryId || ""}
                        onChange={handleSelectChange("categoryId")}
                        size="small"
                        SelectProps={{
                            displayEmpty: true,
                        }}
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
                        label="Mô tả sản phẩm"
                        fullWidth
                        variant="outlined"
                        size="small"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange("description")}
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel>Hình Ảnh</InputLabel>
                        <Stack
                            direction="row"
                            spacing={4}
                            alignItems="flex-start"
                            sx={{
                                flexWrap: "wrap", // Cho phép xuống hàng khi không đủ không gian
                                overflowX: "auto",  // Tạo thanh cuộn ngang nếu kích thước không đủ
                            }}
                        >
                            {/* Ảnh chính */}
                            <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
                                <Typography variant="body1">Ảnh chính</Typography>
                                <Grid container spacing={2}>
                                    {/* Hiển thị ảnh chính hoặc nút tải lên */}
                                    {imagePreview ? (
                                        <Grid item xs={6} sm={4} md={3}>
                                            <div style={{ position: "relative" }}>
                                                <img
                                                    src={imagePreview}
                                                    alt="Main product"
                                                    style={{
                                                        width: "100%",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                        backgroundColor: "#ffffffcc",
                                                        "&:hover": { backgroundColor: "#ffffff" },
                                                    }}
                                                    onClick={() => setImagePreview(null)}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </div>
                                        </Grid>
                                    ) : (
                                        <Grid item xs={6} sm={4} md={3}>
                                            <label htmlFor="main-image-upload">
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "120px",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        border: "2px dashed #ccc",
                                                        borderRadius: "8px",
                                                        cursor: "pointer",
                                                        backgroundColor: "#f5f5f5",
                                                    }}
                                                >
                                                    <UploadFileOutlined />
                                                    <span style={{ marginLeft: "8px" }}>Tải ảnh</span>
                                                </div>
                                            </label>
                                            <input
                                                accept="image/*"
                                                id="main-image-upload"
                                                type="file"
                                                style={{ display: "none" }}
                                                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0], true)}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </div>

                            {/* Ảnh phụ */}
                            <div style={{ flex: "1 1 45%", minWidth: "300px" }}>
                                <Typography variant="body1">Ảnh phụ</Typography>
                                <Grid container spacing={2}>
                                    {/* Nút "Thêm ảnh phụ" */}
                                    <Grid item xs={6} sm={4} md={3}>
                                        <label htmlFor="additional-image-upload">
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "120px",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    border: "2px dashed #ccc",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    backgroundColor: "#f5f5f5",
                                                }}
                                            >
                                                <UploadFileOutlined />
                                                <span style={{ marginLeft: "8px", fontSize: "16px" }}>Tải ảnh</span>
                                            </div>
                                        </label>
                                        <input
                                            accept="image/*"
                                            id="additional-image-upload"
                                            type="file"
                                            multiple
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    const files = Array.from(e.target.files); // Chuyển FileList thành mảng
                                                    const newPreviews = files.map((file) => URL.createObjectURL(file));
                                                    setAdditionalImagePreviews([...additionalImagePreviews, ...newPreviews]); // Cập nhật danh sách preview

                                                    // Cập nhật danh sách file
                                                    setAdditionalImageFiles([...additionalImageFiles, ...files]);
                                                }
                                            }}
                                        />
                                    </Grid>

                                    {/* Hiển thị danh sách ảnh phụ */}
                                    {additionalImagePreviews.map((preview, index) => (
                                        <Grid item xs={6} sm={4} md={3} key={index}>
                                            <div style={{ position: "relative" }}>
                                                <img
                                                    src={preview}
                                                    alt={`Additional product ${index}`}
                                                    style={{
                                                        width: "100%",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                />
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                        backgroundColor: "#ffffffcc",
                                                        "&:hover": { backgroundColor: "#ffffff" },
                                                    }}
                                                    onClick={() => {
                                                        const updatedImages = additionalImages.filter((_, i) => i !== index);
                                                        setAdditionalImages(updatedImages);
                                                    }}
                                                >
                                                    <Close />
                                                </IconButton>
                                            </div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </div>
                        </Stack>
                    </FormControl>
                </Grid>


                <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
                        Lưu
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onCancel}>
                        Hủy
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default UpdateProduct;
