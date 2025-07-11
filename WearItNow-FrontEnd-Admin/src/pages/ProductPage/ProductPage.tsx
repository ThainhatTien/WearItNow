import { useEffect, useMemo, useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Tooltip, Typography, Stack, InputAdornment, CircularProgress, Fab, Box } from '@mui/material';
import { Inventory, Product } from 'types/ProductTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { fetchCategories } from 'store/Category/CategotiesAction';
import { deleteProduct, fetchProductsBySearch, handleUpdateProduct, setProductCurrentPage, handleAddProducts, fetchOneProduct } from 'store/Product/ProductAction';
// import { postProductService, putProductService } from 'services/ApiProducts';
import { CategoryWithId } from 'types/CategoryType';
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridSlots } from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import AddProductForm from './AddProduct';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import UpdateProductForm from './UpdateProduct';
import { useSnackbar } from 'notistack';
import { debounce } from 'lodash';
import CustomPaginationWrapper from './CustomPaginationWrapper';
import { AddCircleOutline } from '@mui/icons-material';
import { createInventory, fetchAllInventory, fetchInventoryByProductId } from 'store/ProductInventory/InventoryAction';
import InventoryEditForm from './InventoryTable';
import ProductDetailView from './ProductDetail';
import Splash from 'components/loading/Splash';
import { sizes } from 'data/colors';



const ProductManagement = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { products, product, productPageSize, productCurrentPage, totalProductPages, loading, error } = useSelector((state: any) => state.productData);
    const { categories ,categoryCurrentPage, categoryPageSize} = useSelector((state: any) => state.categoryData);
    const { inventories, inventoriesProduct } = useSelector((state: any) => state.InventoryData);
    const [searchName, setSearchName] = useState<string>("");
    const [color, setColor] = useState<string>("")
    const [productSize, setProductSize] = useState<string>("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isProductViews, setIsProductViews] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isInventoryModalVisible, setIsInventoryModalVisible] = useState(false); // Mới thêm
    const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const { enqueueSnackbar } = useSnackbar(); // Sử dụng useSnackbar để hiển thị thông báo
    
    
    useEffect(()=>{
         // Lấy danh sách các danh mục
         dispatch(fetchCategories(search));
         dispatch(fetchAllInventory())
    }, [])
    useEffect(() => {
        // Tạo hàm fetch sản phẩm
        const fetchProducts = () => {
            dispatch(fetchProductsBySearch(searchParams));
        };
        // Sử dụng debounce cho hàm fetch
        const debouncedFetchProducts = debounce(fetchProducts, 500);
        // Nếu có tìm kiếm hoặc chọn danh mục, gọi hàm debounce
        debouncedFetchProducts();
        return () => {
            debouncedFetchProducts.cancel();
        };
    }, [searchName, color, productSize, selectedCategoryId, productCurrentPage, productPageSize, dispatch]);
    const search ={
        page: categoryCurrentPage,
        size: categoryPageSize
      }
    const searchParams = {
        productName: searchName || "",
        categoryId: selectedCategoryId,
        color: color,
        productSize: productSize,
        size: productPageSize,
        page: productCurrentPage
    };

    const textFieldSxStyle = {
        '.MuiFilledInput-root': {
            height: 40,
            bgcolor: 'grey.A100',
            ':hover': { bgcolor: 'background.default' },
            ':focus': { bgcolor: 'background.default' },
            ':focus-within': { bgcolor: 'background.default' },
        },
        borderRadius: 2,
        height: 40,
    };

    const inputAdornmentProps = {
        startAdornment: (
            <InputAdornment position="end">
                <IconifyIcon icon="akar-icons:search" width={13} height={13} />
            </InputAdornment>
        ),
    };
    const uniqueInventories = useMemo(() => {
        const seen = new Map();
        return inventories.filter((inventory: Inventory) => {
            const key = `${inventory.color}`;
            if (!seen.has(key)) {
                seen.set(key, true); // Đánh dấu là đã gặp
                return true; // Thêm vào mảng kết quả
            }
            return false; // Bỏ qua phần tử trùng lặp
        });
    }, [inventories]);
    // Hàm mở Modal thêm sản phẩm
    const handleAddProduct = () => {
        setIsAddModalVisible(true); // Mở Modal thêm sản phẩm
    };

    // Hàm xử lý sự kiện khi người dùng nhấn nút chỉnh sửa
    const handleEdit = (product: Product) => {
        setCurrentProduct(product); // Cập nhật sản phẩm hiện tại để chỉnh sửa
        setIsEditModalVisible(true); // Mở Modal chỉnh sửa
    };

    // Hàm xử lý sự kiện khi người dùng nhấn nút xóa
    const handleDeleteClick = (productId: number) => {
        setDeleteProductId(productId); // Lưu lại productId cần xóa
        setIsDeleteModalVisible(true); // Mở Dialog xác nhận xóa
    };

    // Hàm xác nhận xóa sản phẩm
    const confirmDeleteProduct = async () => {
        if (deleteProductId !== null) {
            try {
                await dispatch(deleteProduct(deleteProductId, searchParams)); // Gọi action để xóa sản phẩm
                enqueueSnackbar('Xóa sản phẩm thành công.', { variant: 'success' }); // Hiển thị thông báo thành công
                setIsDeleteModalVisible(false); // Đóng Dialog sau khi xóa thành công
            } catch (error) {
                enqueueSnackbar('Xóa sản phẩm thất bại.', { variant: 'error' }); // Hiển thị thông báo thất bại
                console.error("Error deleting product:", error); // Ghi lại lỗi trong console
            }
        }
    };

    const handleViewProduct = (productId: number) => {
        dispatch(fetchOneProduct(productId))
        setIsProductViews(true)
    }
    // Hàm xử lý sự kiện khi người dùng hủy bỏ chỉnh sửa
    const handleEditModalCancel = () => {
        setIsEditModalVisible(false); // Đóng Modal chỉnh sửa
        setCurrentProduct(null); // Reset sản phẩm hiện tại
    };

    // Hàm xử lý sự kiện khi người dùng hủy bỏ thêm sản phẩm
    const handleAddModalCancel = () => {
        setIsAddModalVisible(false); // Đóng Modal thêm sản phẩm
    };
    const handleProductViewCancel = () => {
        setIsProductViews(false); // Đóng Modal thêm sản phẩm
    };
    // Hàm sửa sản phẩm
    const onUpdateProduct = (productId: number, formData: FormData) => {
        dispatch(handleUpdateProduct(productId, formData, searchParams)); // Gọi action handleUpdateProduct
        setIsEditModalVisible(false); // Đóng modal chỉnh sửa
        setCurrentProduct(null); // Reset sản phẩm hiện tại
    };

    // Hàm xử lý thêm sản phẩm
    const onAddProduct = (formData: FormData) => {
        // Gọi action với formData và searchParams
        dispatch(handleAddProducts(formData, searchParams));
        setIsAddModalVisible(false); // Đóng modal thêm sản phẩm
    };

    const rowsWithSTT = products.map((product: Product, index: number) => ({
        ...product,
        stt: index + 1 + (productCurrentPage - 1) * productPageSize, // Tính STT dựa trên chỉ số
    }));
    //hàm gọi kho theo id sản phẩm
    const handleEditInventory = async (productId: number) => {
        try {
            // Gọi API để lấy thông tin inventory của sản phẩm
            dispatch(fetchInventoryByProductId(productId));  // Gọi API để lấy tồn kho cho mỗi sản phẩm
            setSelectedProductId(productId);  // Lưu productId vào state
            setIsInventoryModalVisible(true);  // Mở modal Inventory
        } catch (error) {
            console.error('Lỗi khi lấy thông tin inventory:', error);
        }
    };

    const handleSaveInventory = async (inventory: Inventory) => {
        try {
            dispatch(createInventory(inventory))
            // setIsInventoryModalVisible(true)
            dispatch(fetchProductsBySearch({
                productName: searchName || "",
                categoryId: selectedCategoryId,
                color: color,
                productSize: productSize,
                size: productPageSize,
                page: productCurrentPage
            })); // Lấy lại danh sách sản phẩm mới
        } catch (error) {
            console.error('Lỗi khi thêm Kho:', error);
        }
    }
    const handleClearFilters = () => {
        setSearchName("");
        setProductSize("");
        setColor("");
        setSelectedCategoryId(0); // Hoặc "", tùy thuộc vào logic của bạn
    };

    const columns: GridColDef<any>[] = [
        {
            field: 'stt',
            headerName: 'STT',
            resizable: false,
            minWidth: 10,
        },
        {
            field: 'name',
            headerName: 'Tên sản phẩm',
            flex: 1,
            minWidth: 155,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant="body2">{params.value}</Typography>
            ),
        },
        {
            field: 'category',
            headerName: 'Danh mục',
            flex: 1,
            minWidth: 155,
            renderCell: (params: GridRenderCellParams) => {
                // Lấy thông tin category từ params.row 
                const category = params.row.category;
                // Kiểm tra nếu category tồn tại và hiển thị tên danh mục
                return <span>{category ? category.name : "Không có danh mục"}</span>;
            },
        },
        {
            field: 'price',
            headerName: 'Giá',
            flex: 1,
            minWidth: 95,
            renderCell: (params: GridRenderCellParams) =>
                params.value
                    ? `${new Intl.NumberFormat('vi-VN').format(params.value)} VND`
                    : 'N/A',
        },
        {
            field: 'image',
            headerName: 'Hình ảnh',
            flex: 1,
            minWidth: 120,

            renderCell: (params: GridRenderCellParams) => (
                <img src={params.value} alt="Hình ảnh sản phẩm" style={{ width: 60, height: 150, objectFit: "contain" }} />
            ),
        },
        {
            field: 'actions-product',
            headerName: 'Hành động',
            type: 'actions',
            flex: 1,
            minWidth: 80,
            getActions: (params) => [
                <Tooltip title="Chỉnh sửa Inventory" key="edit-inventory">
                    <GridActionsCellItem
                        icon={<IconifyIcon icon="material-symbols:inventory-2-outline" color="primary.main" />}
                        label="Edit Inventory"
                        size="small"
                        onClick={() => handleEditInventory(params.row.productId)} // Mở modal để chỉnh sửa inventory
                    />
                </Tooltip>,
                // Hành động Xem chi tiết
                <Tooltip title="View Details" key="view">
                    <GridActionsCellItem
                        icon={<IconifyIcon icon="mdi:eye" color="info.main" />}
                        label="View"
                        size="small"
                        onClick={() => {
                            handleViewProduct(params.row.productId)
                        }}
                    />
                </Tooltip>,

                <Tooltip title="Sửa" key="edit" >
                    <GridActionsCellItem
                        icon={<IconifyIcon icon="fluent:edit-32-filled" color="text.secondary" />}
                        label="Edit"
                        size="small"
                        onClick={() => handleEdit(params.row)} // Lưu thông tin sản phẩm vào state khi click vào edit
                    />
                </Tooltip>,
                <Tooltip title="Xóa" key="delete">
                    <GridActionsCellItem
                        icon={<IconifyIcon icon="mingcute:delete-3-fill" color="error.main" />}
                        label="Delete"
                        size="small"
                        onClick={() => handleDeleteClick(params.row.productId)} // Lưu productId cần xóa
                    />
                </Tooltip>,
            ],
        },
    ];

    return (
        <div className="p-4">
            <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" color="common.white">Quản lý sản phẩm</Typography>
                    <FormControl>
                        <Tooltip title="Thêm mới sản phẩm">
                            <Fab color="primary" aria-label="add" onClick={handleAddProduct}>
                                <AddCircleOutline />
                            </Fab>
                        </Tooltip>
                    </FormControl>
                </Box>
                {/* Tìm kiếm sản phẩm */}
                <Stack direction="row" spacing={2} mb={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} gap={2}>
                        <FormControl sx={{ flex: 1, width: '20%' }}>
                            <InputLabel htmlFor="product-name">Tên Sản Phẩm</InputLabel>
                            <TextField
                                id="product-name"
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                                placeholder="Tìm kiếm sản phẩm..."
                                fullWidth
                                variant="filled"
                                size="small"
                                sx={textFieldSxStyle}
                                InputProps={inputAdornmentProps}
                            />
                        </FormControl>
                    </Box>
                    <FormControl sx={{ width: '10%' }} >
                        <InputLabel htmlFor="product-size">Size</InputLabel>
                        <Select
                            id="product-size"
                            value={productSize || ""}
                            onChange={(e) => setProductSize(e.target.value)}
                            fullWidth
                            displayEmpty
                            size="small"
                            sx={{
                                ...textFieldSxStyle, // Nếu bạn có style dùng chung
                            }}
                        >
                            {/* MenuItem đầu tiên hiển thị placeholder */}
                            <MenuItem value="">
                                <em>Tất cả</em>
                            </MenuItem>

                            {/* Danh sách size */}
                            {sizes.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: '10%' }}>
                        <InputLabel htmlFor="category-select">Chọn Màu</InputLabel>
                        <Select
                            id="color-select"
                            value={color || ""}
                            onChange={(e) => setColor(e.target.value as string)}
                            displayEmpty
                            size="small"
                        >
                            <MenuItem value="">
                                <em>Tất cả</em>
                            </MenuItem>
                            {uniqueInventories.map((inventory: Inventory) => (
                                <MenuItem key={inventory.color} value={inventory.color}>
                                    <Box
                                        sx={{
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            width: '100%',
                                            alignItems: 'center', 
                                        }}
                                    >
                                        {/* Ô màu bên trái */}
                                        <Box
                                            sx={{
                                                width: 20,
                                                height: 20,
                                                backgroundColor: inventory.color,
                                                borderRadius: '50%',
                                                marginRight: 1, // Khoảng cách giữa ô màu và mã màu
                                            }}
                                        />
                                        {/* Mã màu bên phải */}
                                        {inventory.color}
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: '20%' }}>
                        <InputLabel htmlFor="category-select">Chọn danh mục</InputLabel>
                        <Select
                            id="category-select"
                            value={selectedCategoryId || ""}
                            onChange={(e) => setSelectedCategoryId(e.target.value as number)}
                            displayEmpty
                            size="small"
                        >
                            <MenuItem value="">
                                <em>Tất cả</em>
                            </MenuItem>
                            {categories.map((category: CategoryWithId) => (
                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                
                    <FormControl>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleClearFilters}
                            sx={{ height: '40px', width: '10%', marginTop: '24px'}}
                        >
                            Clear
                        </Button>
                    </FormControl>
                </Stack>
                {/* Hiển thị danh sách sản phẩm */}
                <div>
                    {loading ? (
                        <Splash />
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : (
                        <DataGrid
                            rows={rowsWithSTT} // Sử dụng danh sách đã lọc
                            columns={columns}
                            autoHeight
                            disableColumnMenu // Vô hiệu hóa menu cột
                            disableRowSelectionOnClick // Vô hiệu hóa chọn hàng khi click
                            getRowId={(row) => row.productId} // Xác định ID của hàng
                            // loading={loading} // Hiển thị overlay loading khi đang fetch dữ liệu
                            sx={{
                                height: 1,
                                width: 1,
                                tableLayout: 'fixed',
                                scrollbarWidth: 'thin',
                            }}
                            slots={{
                                loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
                                pagination: () => (
                                    <CustomPaginationWrapper
                                        page={productCurrentPage} // Truyền trang hiện tại (zero-based)
                                        totalPages={totalProductPages} // Truyền tổng số trang
                                        onPageChange={(newPage: number) => {
                                            // Cập nhật trang hiện tại và gọi API
                                            setProductCurrentPage(newPage + 1); // Chuyển từ zero-based thành one-based
                                            dispatch(fetchProductsBySearch({
                                                productName: searchName || "",
                                                categoryId: selectedCategoryId,
                                                color: color,
                                                productSize: productSize,
                                                size: productPageSize,
                                                page: newPage + 1 // One-based khi gọi API
                                            }));
                                        }}
                                    />
                                ),
                                noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
                            }}
                        />
                    )}
                </div>
            </Paper>
            <Dialog open={isProductViews} onClose={handleProductViewCancel} maxWidth="sm">
                {/* <DialogTitle>{product.name}</DialogTitle> */}
                <DialogContent>
                    <ProductDetailView
                        open={isProductViews}
                        product={product}
                        onCancel={handleProductViewCancel}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProductViewCancel} color="secondary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Modal thêm sản phẩm */}
            <Dialog open={isAddModalVisible} onClose={handleAddModalCancel} maxWidth="sm">
                <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                <DialogContent sx={{ padding: '2rem' }}> {/* Thêm padding cho DialogContent */}
                    <AddProductForm
                        onSubmit={onAddProduct}
                        onCancel={handleAddModalCancel}
                    />
                </DialogContent>
            </Dialog>

            {/* Modal sửa sản phẩm */}
            <Dialog open={isEditModalVisible} onClose={handleEditModalCancel}>
                <DialogContent>
                    {currentProduct && (
                        <UpdateProductForm
                            product={currentProduct}
                            productId={currentProduct.productId}
                            onUpdate={onUpdateProduct}
                            onCancel={handleEditModalCancel}
                        />
                    )}
                </DialogContent>
            </Dialog>
            {/* Modal quản lý tồn kho */}
            <Dialog open={isInventoryModalVisible} onClose={() => setIsInventoryModalVisible(false)}>
                <DialogTitle>Quản lý Tồn Kho</DialogTitle>
                <DialogContent>
                    {inventoriesProduct && (
                        <InventoryEditForm
                            open={isInventoryModalVisible}
                            inventoryData={inventoriesProduct}
                            onClose={() => setIsInventoryModalVisible(false)}
                            onSave={handleSaveInventory}  // Thêm hàm xử lý lưu thông tin
                            productId={selectedProductId}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal xác nhận xóa sản phẩm */}
            <Dialog
                open={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)} // Đóng dialog khi không muốn xóa
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa sản phẩm này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDeleteModalVisible(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={confirmDeleteProduct} color="error" variant="contained">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ProductManagement;
