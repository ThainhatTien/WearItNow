import { useMemo, useEffect, ReactElement, useState } from 'react';
import { Stack, Avatar, Tooltip, Typography, CircularProgress, TextField, Paper, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridSlots,
  GridColDef,
  useGridApiRef,
  GridActionsCellItem,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { stringAvatar } from 'helpers/string-avatar';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';
import { DeleteUserService, UpdateUserService, UserService } from 'services/ApiUser';
import { fetchUsersFailure, fetchUsersSuccess, getAllUser, setCurrentPage } from 'store/User/UserAction';
import { useDispatch, useSelector } from 'react-redux';
import { UserType, UserWithId } from 'types/User.type';
import { fetchRolesFailure, fetchRolesSuccess, getAllRole } from 'store/Role/RoleAction';
import { getAllRoleService } from 'services/ApiRole';
import EditUserModal from './UserEditPage';
import UserForm from './AddUsserPage';
import { useSnackbar } from 'notistack';
import CustomPaginationWrapper from 'pages/ProductPage/CustomPaginationWrapper';
import Splash from 'components/loading/Splash';

const CustomerTable = (): ReactElement => {
  const { roleData } = useSelector((state: any) => state.role); // Lấy dữ liệu role từ Redux store
  const apiRef = useGridApiRef<GridApi>(); // Khởi tạo apiRef cho DataGrid
  const dispatch = useDispatch(); // Hook để truy cập dispatch từ Redux
  const { enqueueSnackbar } = useSnackbar();// Sử dụng useSnackbar
  // Khai báo state cho searchText
  const [searchText, setSearchText] = useState<string>(''); // Lưu giá trị tìm kiếm
  const [openEditModal, setOpenEditModal] = useState<boolean>(false); // State để điều khiển modal chỉnh sửa
  const [currentUser, setCurrentUser] = useState<UserWithId | null>(null); // State để lưu thông tin user hiện tại
  const [openAddModal, setOpenAddModal] = useState<boolean>(false); // State để điều khiển modal thêm mới
  const [loading, setLoading] = useState<boolean>(false);// State loding
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  // State cho modal xác nhận xóa



  // Lấy thông tin người dùng từ Redux store
  const { users, currentPage, pageSize, totalPages, error } = useSelector((state: any) => state.userData);

  const columns: GridColDef<any>[] = [
    {
      field: 'stt',
      headerName: 'STT',
      resizable: false,
      minWidth: 30,
    },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (params: GridRenderCellParams<any>) => (
        <Stack direction="row" gap={1} alignItems="center">
          <Tooltip title={`${params.row.firstname} ${params.row.lastname}`} placement="top" arrow>
            <Avatar {...stringAvatar(`${params.row.firstname} ${params.row.lastname}`)} />
          </Tooltip>
          <Typography variant="body2">{`${params.row.firstname} ${params.row.lastname}`}</Typography>
        </Stack>
      ),
      resizable: false,
      flex: 1,
      minWidth: 155,
    },
    {
      field: 'email',
      headerName: 'Email',
      resizable: false,
      flex: 0.5,
      minWidth: 145,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      resizable: false,
      flex: 1,
      minWidth: 115,
    },
    {
      field: 'username',
      headerName: 'Username',
      sortable: false,
      resizable: false,
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'gender',
      headerName: 'Gender',
      resizable: false,
      flex: 1,
      minWidth: 70,
      renderCell: (params) => (params.value ? 'Nam' : 'Nữ'),
    },

    // {
    //   field: 'address',
    //   headerName: 'Address',
    //   resizable: false,
    //   flex: 1,
    //   minWidth: 115,
    // },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      resizable: false,
      flex: 1,
      minWidth: 80,
      getActions: (params) => [
        <Tooltip title="Edit" key="edit">
          <GridActionsCellItem
            icon={<IconifyIcon icon="fluent:edit-32-filled" color="text.secondary" />}
            label="Edit"
            size="small"
            // onClick={() => updateUser(params.row.userId)} // Lưu thông tin user vào state khi click vào edit
            onClick={() => handleEdit(params.row)} // Lưu thông tin user vào state khi click vào edit
          />
        </Tooltip>,
        <Tooltip title="Delete" key="delete">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mingcute:delete-3-fill" color="error.main" />}
            label="Delete"
            size="small"
            onClick={() => handleDelete(params.row.userId)} // Lưu userId cần xóa
          />
        </Tooltip>,
      ],
    },
  ];


  const [editedUser, setEditedUser] = useState<UserType>({
    username: "",
    password: "",
    lastname: "",
    firstname: "",
    phone: "",
    email: "",
    gender: true, // Mặc định là true
    address: "",
    dob: new Date(),
    roles: [], // Mảng chứa các vai trò của user
  });

  // Hàm để lấy dữ liệu role từ API
  const fetchRole = async () => {
    dispatch(getAllRole()); // Khởi tạo action để lấy role
    try {
      const response = await getAllRoleService(); // Gọi API để lấy dữ liệu role

      dispatch(fetchRolesSuccess(response.data.result)); // Cập nhật dữ liệu role vào Redux store
    } catch (error) {
      dispatch(fetchRolesFailure('Có lỗi xảy ra khi lấy role.')); // Xử lý lỗi
    }
  };
  // useEffect để thiết lập bộ lọc tìm kiếm cho DataGrid
  useEffect(() => {
    apiRef.current.setQuickFilterValues(
      searchText.split(/\b\W+\b/).filter((word: string) => word !== ''), // Tách từ tìm kiếm
    );
  }, [searchText, apiRef]);

  // Lọc các cột hiển thị trong DataGrid
  const visibleColumns = useMemo(
    () => columns.filter((column) => column.field !== 'userId'), // Ẩn cột 'userId'
    [],
  );

  // Chuyển đổi dữ liệu người dùng để thêm số thứ tự
  const processedUsers = users.map((user: UserWithId, index: number) => ({
    ...user,
    stt: index + 1 + (currentPage - 1) * pageSize, // Tính số thứ tự
  }));

  // hàm Mở modal thêm mới
  const handleAddNewUser = () => {
    setOpenAddModal(true);
  };
  // Hàm để mở dialog xác nhận xóa
  const handleDelete = (userId: number) => {
    setUserIdToDelete(userId); // Lưu userId vào state
    setOpenConfirmDialog(true); // Mở dialog xác nhận
  };

  // useEffect để lấy dữ liệu role và người dùng
  useEffect(() => {
    fetchRole(); // Lấy dữ liệu role
    fetchUsers(currentPage, pageSize); // Lấy dữ liệu người dùng
  }, [currentPage, pageSize]);

  // Hàm để lấy dữ liệu người dùng từ API
  const fetchUsers = async (page: number, size: number) => {
    dispatch(getAllUser()); // Khởi tạo action để lấy người dùng
    try {
      const response = await UserService(page, size); // Gọi API để lấy dữ liệu người dùng
      dispatch(fetchUsersSuccess(
        response.data.result.data,
        response.data.result.currentPage,
        response.data.result.pageSize,
        response.data.result.totalElements,
        response.data.result.totalPages,
      )); // Cập nhật dữ liệu người dùng vào Redux store
      // enqueueSnackbar('User GetAll successfully.', { variant: 'success' }); // Thông báo thành công
    } catch (error) {
      dispatch(fetchUsersFailure('Có lỗi xảy ra khi lấy dữ liệu người dùng.')); // Xử lý lỗi
      enqueueSnackbar('User getAll error.', { variant: 'error' }); // Thông báo thành công
      console.error(error);
    }
  };

  // Hàm để xử lý sự kiện chỉnh sửa người dùng
  const handleEdit = (user: UserWithId) => {
    setLoading(true); // Bắt đầu loading
    const userWithStringRoles = {
      ...user,
      roles: user.roles.map((role) => (typeof role === 'string' ? role : role.name)), // Chuyển đổi từ object sang string
    };
    setCurrentUser(user); // Lưu thông tin user vào state hiện tại
    setEditedUser(userWithStringRoles); // Khởi tạo state cho thông tin đã chỉnh sửa
    setOpenEditModal(true); // Mở modal chỉnh sửa
    setLoading(false); // Kết thúc loading
  };

  // Hàm để lưu thông tin chỉnh sửa
  const handleSaveEdit = async () => {
    if (currentUser && editedUser) {
      try {
        const updatedUser = {
          ...editedUser,
          roles: editedUser.roles.map(role => (typeof role === 'string' ? role : role.name)), // Đảm bảo roles là mảng chuỗi
        };
        await UpdateUserService(currentUser.userId, updatedUser);
        enqueueSnackbar('User Update successfully.', { variant: 'success' }); // Thông báo thành công
        fetchUsers(currentPage, pageSize); // Cập nhật danh sách người dùng
        setOpenEditModal(false); // Đóng modal
      } catch (error) {
        console.error("Error updating user:", error);
        enqueueSnackbar('Failed to Update user.', { variant: 'error' }); // Thông báo lỗi
        // Bạn có thể xử lý lỗi tại đây, ví dụ thông báo cho người dùng
      }
    } else {
      console.warn("currentUser is null or editedUser is undefined.");
    }
  };
  
  // Hàm để xử lý sự kiện xóa người dùng
  const confirmDelete = async () => {
    if (userIdToDelete !== null) {
      setLoading(true); // Bắt đầu loading
      try {
        await DeleteUserService(userIdToDelete); // Gọi API để xóa người dùng
        fetchUsers(currentPage, pageSize); // Cập nhật danh sách người dùng
        enqueueSnackbar('User deleted successfully.', { variant: 'success' }); // Thông báo thành công
        setOpenConfirmDialog(false)
      } catch (error) {
        console.error("Error deleting user:", error);
        enqueueSnackbar('Failed to delete user.', { variant: 'error' }); // Thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc loading
      }
    }
  };

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1, borderRadius: '12px' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5} flexWrap="wrap" gap={3}>
        <Typography variant="h4" color="common.white">
          Quản Lý tài Khoản người dùng
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            variant="filled"
            placeholder="Search..."
            value={searchText} // Lưu giá trị tìm kiếm vào state
            onChange={(e) => setSearchText(e.target.value)} // Cập nhật giá trị tìm kiếm khi thay đổi
            sx={{
              '.MuiFilledInput-root': {
                bgcolor: 'grey.A100',
                ':hover': { bgcolor: 'background.default' },
                ':focus': { bgcolor: 'background.default' },
                ':focus-within': { bgcolor: 'background.default' },
              },
              borderRadius: 2,
              height: 40,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <IconifyIcon icon="akar-icons:search" width={13} height={13} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddNewUser}
            startIcon={<IconifyIcon icon="akar-icons:plus" />}
          >
            Thêm mới
          </Button>
        </Stack>
      </Stack>
      <div>
      {loading ? (
        <Splash />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <DataGrid
          apiRef={apiRef} // Sử dụng apiRef để tương tác với DataGrid
          rows={processedUsers} // Dữ liệu người dùng
          columns={visibleColumns} // Cột hiển thị trong DataGrid
          density="standard"
          autoHeight
          rowHeight={56}
          disableColumnMenu // Vô hiệu hóa menu cột
          disableRowSelectionOnClick // Vô hiệu hóa chọn hàng khi click
          getRowId={(row) => row.userId} // Xác định ID của hàng
          paginationModel={{
            page: currentPage - 1, // Chuyển từ one-based thành zero-based
            pageSize: pageSize
          }}
          initialState={{
            pagination: { paginationModel: { page: currentPage - 1, pageSize: pageSize } },
          }}
          slots={{
            loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
            pagination: () => (
              <CustomPaginationWrapper
                page={currentPage} // Truyền trang hiện tại (zero-based)
                totalPages={totalPages} // Truyền tổng số trang
                onPageChange={(newPage: number) => {
                  setCurrentPage(newPage + 1); // Chuyển từ zero-based thành one-based
                  fetchUsers(newPage + 1, pageSize);
                }}
              />
            ),
            noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
          }}
          sx={{
            // height: 1,
            // width: 1,
            tableLayout: 'fixed',
            scrollbarWidth: 'thin',
          }}
        />
      )}
      </div>
      {/* Modal chỉnh sửa thông tin user */}
      <EditUserModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        editedUser={editedUser}
        setEditedUser={setEditedUser}
        roleData={roleData}
        onSave={handleSaveEdit}
        loading={loading}
      />
      <UserForm
        open={openAddModal}
        onUserAdded={() => fetchUsers(currentPage, pageSize)}
        onClose={() => setOpenAddModal(false)}
        loading={false} // Thay đổi thành true nếu bạn đang xử lý việc thêm người dùng
      />
      {/* Dialog xác nhận xóa */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Xác Nhận Xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa người dùng này không?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Hủy</Button>
          <Button onClick={confirmDelete} color="error">Xóa</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}

    </Paper>
  );
};

export default CustomerTable;
