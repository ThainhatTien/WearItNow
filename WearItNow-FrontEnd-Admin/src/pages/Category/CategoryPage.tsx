import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams, GridSlots } from '@mui/x-data-grid';
import { AppDispatch } from 'store';
import { addCategory, deleteCategory, fetchCategories, setCategoryCurrentPage } from 'store/Category/CategotiesAction';
import { Category, CategoryWithId } from 'types/CategoryType';
import Splash from 'components/loading/Splash';
import { Button, Box, Typography, Paper, Tooltip, Stack, Modal, CircularProgress } from '@mui/material';
import AddCategoryModal from './AddCategory';
import IconifyIcon from 'components/base/IconifyIcon';
import ViewCategoryModal from './ViewCategory';
import CustomPaginationWrapper from 'pages/ProductPage/CustomPaginationWrapper';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';


const CategoryTable = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error, categoryCurrentPage, categoryPageSize, totalCategoryPages } = useSelector((state: any) => state.categoryData);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithId | null>(null); // Lưu category được chọn
  const [open, setOpen] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryWithId | null>(null);

  // State lưu danh mục con
  const [subCategories, setSubCategories] = useState<CategoryWithId[]>([]);
  const [openSubCategoryModal, setOpenSubCategoryModal] = useState(false);

  // Fetch categories khi component mount
  const search = {
    page: categoryCurrentPage,
    size: categoryPageSize
  }
  useEffect(() => {
    dispatch(fetchCategories(search));
  }, [dispatch, categoryCurrentPage, categoryPageSize]);

  // Mở modal thêm danh mục
const handleOpen = () => setOpen(true);

// Đóng modal thêm danh mục
const handleClose = () => setOpen(false);

// Mở modal xem chi tiết danh mục và chọn danh mục
const handleOpenView = (category: CategoryWithId) => {
  setSelectedCategory(category); // Lưu danh mục đã chọn để hiển thị trong modal
  setOpenViewModal(true); // Mở modal xem chi tiết danh mục
};

// Đóng modal xem chi tiết danh mục
const handleCloseView = () => {
  setSelectedCategory(null); // Xóa dữ liệu của danh mục đã chọn
  setOpenViewModal(false); // Đóng modal
};

// Thêm danh mục mới và lấy lại danh sách danh mục
const handleAddCategory = (newCategory: Category) => {
  dispatch(addCategory(newCategory, search)); // Thực hiện thêm danh mục mới
  dispatch(fetchCategories(search)); // Lấy lại danh sách danh mục sau khi thêm
};

// Mở modal xác nhận xóa danh mục và chọn danh mục cần xóa
const handleOpenDeleteConfirm = (category: CategoryWithId) => {
  setCategoryToDelete(category); // Lưu danh mục cần xóa
  setOpenDeleteConfirm(true); // Mở modal xác nhận xóa
};

// Đóng modal xác nhận xóa
const handleCloseDeleteConfirm = () => {
  setCategoryToDelete(null); // Xóa danh mục đã chọn để xóa
  setOpenDeleteConfirm(false); // Đóng modal xác nhận xóa
};

// Xóa danh mục đã chọn
const handleDeleteCategory = (categoryId: number) => {
  if (categoryId) {
    dispatch(deleteCategory(categoryId, search)); // Thực hiện xóa danh mục
  } else {
    error.mesage(error) 
  }
};

// Xử lý khi người dùng nhấn vào dòng danh mục
const handleRowClick = (row: CategoryWithId) => {
  // Kiểm tra xem danh mục có danh mục con không
  if (row.subCategories && row.subCategories.length > 0) {
    setSubCategories(row.subCategories); 
    setOpenSubCategoryModal(true); 
  }
};

// Đóng modal danh mục con
const handleCloseSubCategoryModal = () => {
  setSubCategories([]); 
  setOpenSubCategoryModal(false); 
};

// Lọc danh mục chỉ lấy các danh mục không có `parentId`, sau đó thêm trường 'stt' là số thứ tự
const filteredCategories = categories
  .filter((category: Category) => !category.parentId) // Chỉ lấy các danh mục không có parentId (danh mục gốc)
  .map((category: CategoryWithId, index: number) => ({
    ...category,
    stt: index + 1, // Thêm số thứ tự cho mỗi danh mục
  }));


  const columns: GridColDef<any>[] = [
    { field: 'categoryId', headerName: 'Mã ID', width: 100, flex: 1 }, // ID có thể cần ít không gian hơn
    { field: 'name', headerName: 'Tên Danh Mục', flex: 1 }, // Dành nhiều không gian hơn cho tên
    { field: 'slug', headerName: 'Slug', flex: 1 }, // Dành nhiều không gian cho slug
    {
      field: 'subCategories',
      headerName: 'Danh Mục Con',
      width: 180, // Cố định width cho "Danh mục con"
      renderCell: (params) =>
        params.row.subCategories.length > 0 ? `${params.row.subCategories.length} danh mục con` : 'Không có',
      cellClassName: (params) => params.row.subCategories.length > 0 ? 'cursor-pointer' : '',
    },
    { field: 'supplierId', headerName: 'Nhà Cung Cấp', width: 150 }, // Cố định width cho "SupplierID"
    {
      field: 'actions',
      headerName: 'Hành Động',
      type: 'actions',
      width: 120, // Cố định width cho actions
      getActions: (params: GridRowParams) => [
        <Tooltip title="Xem Chi Tiết" key="view">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mdi:eye" color="info.main" />}
            label="Xem"
            size="small"
            onClick={() => handleOpenView(params.row as CategoryWithId)}
          />
        </Tooltip>,
        <Tooltip title="Xóa" key="delete">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mingcute:delete-3-fill" color="error.main" />}
            label="Xóa"
            size="small"
            onClick={() => handleOpenDeleteConfirm(params.row as CategoryWithId)}
          />
        </Tooltip>,
        <Tooltip title="Sửa" key="edit">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mdi:pencil" color="primary.main" />}
            label="Sửa"
            size="small"
            onClick={() => console.log('Sửa Danh Mục:', params.row.categoryId)}
          />
        </Tooltip>,
      ],
    },
  ];


  const columSubCategori: GridColDef<any>[] = [
    { field: 'categoryId', headerName: 'Mã ID', width: 150, flex: 1 },
    { field: 'name', headerName: 'Tên Danh Mục', width: 300, flex: 2 },
    {
      field: 'actions',
      headerName: 'Hành Động',
      type: 'actions',
      width: 120, // Cố định width cho actions
      getActions: (params: GridRowParams) => [
        <Tooltip title="Xem Chi Tiết" key="view">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mdi:eye" color="info.main" />}
            label="Xem"
            size="small"
            onClick={() => handleOpenView(params.row as CategoryWithId)}
          />
        </Tooltip>,
         <Tooltip title="Xóa" key="delete">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mingcute:delete-3-fill" color="error.main" />}
            label="Xóa"
            size="small"
            onClick={() => handleOpenDeleteConfirm(params.row as CategoryWithId)}
          />
        </Tooltip>,
        <Tooltip title="Sửa" key="edit">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mdi:pencil" color="primary.main" />}
            label="Sửa"
            size="small"
            onClick={() => console.log('Sửa Danh Mục:', params.row.categoryId)}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1, borderRadius: '12px' }}>
      <Box p={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5} flexWrap="wrap" gap={3}>
          <Typography variant="h4" color="common.white">
            Quản Lý Danh Mục
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<IconifyIcon icon="akar-icons:plus" />}>
            Thêm Danh Mục
          </Button>
        </Stack>

        {loading ? (
          <Splash />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box sx={{ height: 400, width: '100%', borderRadius: '12px' }}>
            <DataGrid
              rows={filteredCategories}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10, 20]}
              getRowId={(row: CategoryWithId) => row.categoryId}
              onRowClick={(params) => handleRowClick(params.row as CategoryWithId)} // Bắt sự kiện click
              slots={{
                loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
                pagination: () => (
                  <CustomPaginationWrapper
                    page={categoryCurrentPage} // Truyền trang hiện tại (zero-based)
                    totalPages={totalCategoryPages} // Truyền tổng số trang
                    onPageChange={(newPage: number) => {
                      // Cập nhật trang hiện tại và gọi API
                      setCategoryCurrentPage(newPage + 1); // Chuyển từ zero-based thành one-based
                      dispatch(fetchCategories({
                        size: categoryPageSize,
                        page: newPage + 1 // One-based khi gọi API
                      }));
                    }}
                  />
                ),
                noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
              }}
            />
          </Box>
        )}

        {/* Modal Thêm Danh Mục */}
        <AddCategoryModal open={open} onClose={handleClose} onAddCategory={handleAddCategory} />

        {/* Modal Xem Chi Tiết Danh Mục */}
        <ViewCategoryModal open={openViewModal} category={selectedCategory} onClose={handleCloseView} />
        {/* Modal Xác Nhận Xóa */}
        <Modal open={openDeleteConfirm} onClose={handleCloseDeleteConfirm}>
          <Paper sx={{ padding: 3, maxWidth: '400px', margin: 'auto', marginTop: '10%' }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Xác nhận xóa danh mục
            </Typography>
            <Typography textAlign="center" color="text.secondary" mb={2}>
              Bạn có chắc chắn muốn xóa danh mục "<b>{categoryToDelete?.name}</b>" không?
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" color="error"  onClick={() => handleDeleteCategory(categoryToDelete?.categoryId!)}>
                Xóa
              </Button>
              <Button variant="outlined" onClick={handleCloseDeleteConfirm}>
                Hủy
              </Button>
            </Stack>
          </Paper>
        </Modal>

        {/* Modal hiển thị danh mục con */}
        <Modal open={openSubCategoryModal} onClose={handleCloseSubCategoryModal}>
          <Paper sx={{ padding: 3, maxWidth: '400px', margin: 'auto', marginTop: '10%' }}>
            <Typography variant="h5">
              {
                subCategories.length > 0
                  ? categories.find((cat: CategoryWithId) => cat.categoryId === subCategories[0].parentId)?.name || "No Parent"
                  : "No Parent"
              }
            </Typography>
            <DataGrid
              rows={subCategories}
              columns={columSubCategori}
              getRowId={(row: CategoryWithId) => row.categoryId}
            />
          </Paper>
        </Modal>
      </Box>
    </Paper>
  );
};

export default CategoryTable;
