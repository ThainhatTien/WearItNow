import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams, GridRenderCellParams } from '@mui/x-data-grid';
import IconifyIcon from 'components/base/IconifyIcon';
import { format } from 'date-fns';
import { DiscountContext } from 'pages/Discount/DiscountContext';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Discount,
  DiscountStatus,
  DiscountType,
  DiscountWithUserGroupId,
} from 'types/DiscountTypes';
import { useSnackbar } from 'notistack';
import EditIcon from '@mui/icons-material/Edit';

const DiscountTable = () => {
  const context = useContext(DiscountContext);

  if (!context) {
    return <div>Discount context is not available</div>;
  }

  const { discounts, loading, currentPage, pageSize, totalElements, fetchDiscounts, addDiscount } =
    context;

  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    id: 0,
    code: '',
    type: DiscountType.PERCENTAGE,
    amount: 0,
    startDate: '',
    endDate: '',
    status: DiscountStatus.ACTIVE,
    usageLimit: 0,
    minOrderValue: 0,
    userGroupResponse: undefined, // Thêm userGroupResponse để khớp giao diện mới
  });

  const [addDiscountLoading, setAddDiscountLoading] = useState(false); // Thêm trạng thái loading cho Add Discount

  // Sử dụng useRef để lưu giá trị currentPage và pageSize trước đó
  const prevPage = useRef(currentPage);
  const prevPageSize = useRef(pageSize);

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenViewModal = (discount: Discount) => {
    setSelectedDiscount(discount);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedDiscount(null);
    setOpenViewModal(false);
  };

  const handleEditDiscount = (id: number) => {
    console.log('Edit Discount:', id);
    // Implement edit logic here
  };

  const isFormValid = () => {
    if (
      !newDiscount.code ||
      newDiscount.amount <= 0 ||
      (newDiscount.usageLimit ?? 0) <= 0 ||
      (newDiscount.minOrderValue ?? 0) < 0 || // Đảm bảo minOrderValue hợp lệ
      !newDiscount.startDate ||
      !newDiscount.endDate ||
      new Date(newDiscount.startDate) > new Date(newDiscount.endDate)
    ) {
      return false;
    }
    return true;
  };

  // Function để thêm Discount
  const handleAddDiscount = async () => {
    // Validate form
    if (!isFormValid()) {
      enqueueSnackbar('Vui lòng điền đầy đủ các trường bắt buộc với dữ liệu hợp lệ!', { variant: 'error' });
      return;
    }

    try {
      setAddDiscountLoading(true);

      // Chuẩn bị dữ liệu discount với id bắt buộc
      const discountToAdd: DiscountWithUserGroupId = {
        id: newDiscount.id, // Thêm id vào đây
        code: newDiscount.code,
        type: newDiscount.type,
        amount: newDiscount.amount,
        usageLimit: newDiscount.usageLimit ?? 0,
        minOrderValue: newDiscount.minOrderValue ?? 0,
        startDate: format(new Date(newDiscount.startDate), "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(new Date(newDiscount.endDate), "yyyy-MM-dd'T'HH:mm:ss"),
        status: newDiscount.status,
        userGroupResponse: newDiscount.userGroupResponse
          ? { id: newDiscount.userGroupResponse.id } // Chỉ lấy id
          : undefined,
      };

      await addDiscount(discountToAdd); // Thêm discount
      setOpenAddModal(false);
      fetchDiscounts(currentPage, pageSize); // Làm mới danh sách
      setNewDiscount({
        id: 0, // Đảm bảo reset id
        code: '',
        type: DiscountType.PERCENTAGE,
        amount: 0,
        startDate: '',
        endDate: '',
        status: DiscountStatus.ACTIVE,
        users: [],
        usageLimit: 0,
        minOrderValue: 0,
        userGroupResponse: undefined, // Reset userGroupResponse
      }); // Reset form
    } catch (error) {
      enqueueSnackbar('Đã có lỗi xảy ra khi thêm discount. Vui lòng thử lại.', { variant: 'error' });
    } finally {
      setAddDiscountLoading(false);
    }
  };

  const columns: GridColDef<any>[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'code', headerName: 'Code', width: 180 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'usageLimit', headerName: 'Usage Limit', width: 120 },
    { field: 'minOrderValue', headerName: 'Min Order Value', width: 150 },
    {
      field: 'userGroupResponse',
      headerName: 'User Group',
      width: 200,
      renderCell: (params) => {
        const group = params.row.userGroupResponse;
        return group ? group.name : 'N/A';
      },
    },
    {
      field: 'userCount',
      headerName: 'User Count',
      width: 150,
      renderCell: (params) => {
        const users = params.row.userGroupResponse?.users;
        return users ? users.length : 'N/A';
      },
    },

    { field: 'amount', headerName: 'Amount', width: 150 },
    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 180,
      renderCell: (params) => {
        const value = params.row.startDate;
        return value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : 'N/A';
      },
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      width: 180,
      renderCell: (params) => {
        const value = params.row.endDate;
        return value ? format(new Date(value), 'dd/MM/yyyy HH:mm') : 'N/A';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => {
        const status = params.value as string; // Giá trị của cột status
        const color = status === 'ACTIVE' ? 'green' : 'red';
        return (
          <Box
            sx={{
              display: 'inline-block',
              padding: '4px 8px',
              color: color,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {status}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 150,
      getActions: (params: GridRowParams) => [
        <Tooltip title="View Details" key="view">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mdi:eye" color="info.main" />}
            label="View"
            size="small"
            onClick={() => handleOpenViewModal(params.row as Discount)}
          />
        </Tooltip>,
        <Tooltip title="Edit" key="edit">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mdi:pencil" color="primary.main" />}
            label="Edit"
            size="small"
            onClick={() => handleEditDiscount(params.row.id)}
          />
        </Tooltip>,
      ],
    },
  ];

  useEffect(() => {
    if (prevPage.current !== currentPage || prevPageSize.current !== pageSize) {
      fetchDiscounts(currentPage, pageSize);
      prevPage.current = currentPage;
      prevPageSize.current = pageSize;
    }
  }, [currentPage, pageSize, fetchDiscounts]);

  return (
    <>
      <Paper sx={{ p: { xs: 2, sm: 4 }, height: 1, borderRadius: '12px' }}>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Discount Code Management</Typography>
            <Button variant="contained" color="primary" onClick={handleOpenAddModal}>
              Add Discount Code
            </Button>
          </Box>
          <DataGrid
            rows={discounts}
            columns={columns}
            loading={loading}
            pagination
            paginationModel={{
              page: currentPage - 1,
              pageSize: pageSize,
            }}
            pageSizeOptions={[8, 16, 32]}
            rowCount={totalElements}
            paginationMode="server"
            onPaginationModelChange={(newPaginationModel) => {
              const { page, pageSize } = newPaginationModel;
              if (page + 1 !== currentPage || pageSize !== pageSize) {
                fetchDiscounts(page + 1, pageSize);
              }
            }}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
          />
          {/* Modal Add Discount */}
          <Dialog open={openAddModal} onClose={handleCloseAddModal}>
            <DialogTitle>Add Discount</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Code"
                value={newDiscount.code}
                onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value })}
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Type</InputLabel>
                <Select
                  value={newDiscount.type}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, type: e.target.value as DiscountType })
                  }
                  label="Type"
                >
                  <MenuItem value={DiscountType.PERCENTAGE}>Percentage</MenuItem>
                  <MenuItem value={DiscountType.FIXED}>Fixed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Amount"
                value={newDiscount.amount}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, amount: parseFloat(e.target.value) })
                }
                margin="normal"
                type="number"
              />
              <TextField
                fullWidth
                label="Usage Limit"
                value={newDiscount.usageLimit}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, usageLimit: parseInt(e.target.value) })
                }
                margin="normal"
                type="number"
              />
              <TextField
                fullWidth
                label="Start Date"
                value={newDiscount.startDate}
                onChange={(e) => setNewDiscount({ ...newDiscount, startDate: e.target.value })}
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Date"
                value={newDiscount.endDate}
                onChange={(e) => setNewDiscount({ ...newDiscount, endDate: e.target.value })}
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Minimum Order Value"
                value={newDiscount.minOrderValue}
                onChange={(e) =>
                  setNewDiscount({ ...newDiscount, minOrderValue: parseFloat(e.target.value) })
                }
                margin="normal"
                type="number"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={newDiscount.status}
                  onChange={(e) =>
                    setNewDiscount({ ...newDiscount, status: e.target.value as DiscountStatus })
                  }
                  label="Status"
                >
                  <MenuItem value={DiscountStatus.ACTIVE}>Active</MenuItem>
                  <MenuItem value={DiscountStatus.INACTIVE}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddModal} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleAddDiscount}
                color="primary"
                disabled={addDiscountLoading} // Disable button when adding discount
              >
                {addDiscountLoading ? <CircularProgress size={24} color="inherit" /> : 'Add'}
              </Button>
            </DialogActions>
          </Dialog>
          {/* Modal View Discount */}
          <Dialog
            open={openViewModal}
            onClose={handleCloseViewModal}
            maxWidth="sm"
            fullWidth
            sx={{
              '& .MuiDialog-paper': {
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
              },
            }}
          >
            <DialogTitle
              sx={{
                bgcolor: 'black',
                color: 'white',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Discount Details
            </DialogTitle>
            <DialogContent>
              {selectedDiscount && (
                <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
                  {/* General Information & Usage & Timing */}
                  <Box display="flex" gap={4} justifyContent="center" alignItems="flex-start">
                    {/* General Information */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        width: '50%',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        General Information
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1">
                        <strong>Code:</strong> {selectedDiscount.code}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Type:</strong> {selectedDiscount.type}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Minimum Order Value:</strong>{' '}
                        {selectedDiscount.minOrderValue || 'N/A'}
                      </Typography>

                      <Typography variant="body1">
                        <strong>Amount:</strong> {selectedDiscount.amount}
                      </Typography>
                    </Box>

                    {/* Usage & Timing */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        width: '50%',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" color="secondary">
                        Usage & Timing
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body1">
                        <strong>Usage Limit:</strong> {selectedDiscount.usageLimit || 'Unlimited'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Start Date:</strong>{' '}
                        {selectedDiscount.startDate
                          ? format(new Date(selectedDiscount.startDate), 'dd/MM/yyyy')
                          : 'N/A'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>End Date:</strong>{' '}
                        {selectedDiscount.endDate
                          ? format(new Date(selectedDiscount.endDate), 'dd/MM/yyyy')
                          : 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      User Group Details
                    </Typography>
                    <Typography variant="body1">
                      <strong>Group Name:</strong> {selectedDiscount.userGroupResponse.name}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Users:</strong>
                    </Typography>
                    <ul>
                      {selectedDiscount.userGroupResponse.users.map((user) => (
                        <li key={user.userId}>
                          {user.firstname} {user.lastname} - {user.email}
                        </li>
                      ))}
                    </ul>
                  </Box>
                  {/* Status */}
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      boxShadow: 1,
                      mt: 2,
                      mx: 'auto',
                      width: '50%',
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                      Status
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        color: selectedDiscount.status === 'ACTIVE' ? 'success.main' : 'error.main',
                      }}
                    >
                      {selectedDiscount.status}
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseViewModal}
                color="primary"
                variant="contained"
                sx={{ fontWeight: 'bold' }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
    </>
  );
};
export default DiscountTable;
