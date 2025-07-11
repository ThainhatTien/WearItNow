import { Delete, Edit } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Theme } from '@mui/material/styles'; // Import the Theme type
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useSupplierContext } from 'pages/Supplier/SupplierContext';
import React, { useState } from 'react';
import { Supplier } from 'types/supplierTypes';

const SupplierList = () => {
  const { suppliers, loading, handleDeleteSupplier, handleCreateSupplier, handleUpdateSupplier } =
    useSupplierContext();

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Dialog state
  const [dialog, setDialog] = useState<{ open: boolean; supplier: Supplier | null }>({
    open: false,
    supplier: null,
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered rows
  const rows = suppliers
    .filter((supplier) => supplier.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((supplier) => ({
      id: supplier.supplierId,
      ...supplier,
    }));

  // Media queries for responsive design
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm')); // Explicitly type theme as Theme

  // Columns for DataGrid
  const columns: GridColDef[] = [
    { field: 'supplierId', headerName: 'ID', width: isMobile ? 100 : 70 },
    { field: 'name', headerName: 'Tên nhà cung cấp', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Điện thoại', flex: 1 },
    { field: 'taxCode', headerName: 'Mã số thuế', flex: 1 },
    { field: 'description', headerName: 'Mô tả', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Hành động',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Sửa"
          onClick={() => handleEdit(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Xóa"
          onClick={() => handleDelete(params.id as number)}
          showInMenu={false}
        />,
      ],
    },
  ];

  // Handlers
  const handleEdit = (supplier: Supplier) => {
    setDialog({ open: true, supplier });
  };

  const handleCreate = () => {
    setDialog({
      open: true,
      supplier: { supplierId: 0, phone: '', name: '', email: '', taxCode: '', description: '' },
    });
  };

  const handleSave = async () => {
    const { supplier } = dialog;
    if (!supplier) return;

    try {
      if (supplier.supplierId === 0) {
        await handleCreateSupplier(supplier);
        setSnackbar({ open: true, message: 'Tạo nhà cung cấp thành công', severity: 'success' });
      } else {
        await handleUpdateSupplier(supplier.supplierId, supplier);
        setSnackbar({
          open: true,
          message: 'Cập nhật nhà cung cấp thành công',
          severity: 'success',
        });
      }
      setDialog({ open: false, supplier: null });
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi lưu nhà cung cấp', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await handleDeleteSupplier(id);
      setSnackbar({ open: true, message: 'Xóa nhà cung cấp thành công', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Lỗi khi xóa nhà cung cấp', severity: 'error' });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách nhà cung cấp
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row', // Stack vertically for mobile
          alignItems: 'center',
          gap: 1.5,
          marginBottom: 2,
        }}
      >
        {/* Input tìm kiếm */}
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{
            width: isMobile ? '100%' : '250px', // Full width on mobile
            '& .MuiInputBase-root': {
              height: '40px',
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />

        {/* Nút tạo mới */}
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleCreate}
          sx={{
            whiteSpace: 'nowrap',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 16px',
            width: isMobile ? '100%' : 'auto', // Full width on mobile
          }}
        >
          Tạo mới
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10, 20, 30]}
            disableRowSelectionOnClick
            disableColumnFilter
            disableColumnSelector
          />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

      <Dialog open={dialog.open} onClose={() => setDialog((prev) => ({ ...prev, open: false }))}>
        <DialogTitle>
          {dialog.supplier?.supplierId === 0 ? 'Tạo mới nhà cung cấp' : 'Cập nhật nhà cung cấp'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên nhà cung cấp"
            fullWidth
            value={dialog.supplier?.name || ''}
            onChange={(e) =>
              setDialog((prev) => ({
                ...prev,
                supplier: prev.supplier ? { ...prev.supplier, name: e.target.value } : null,
              }))
            }
            margin="dense"
          />
          <TextField
            label="Email"
            fullWidth
            value={dialog.supplier?.email || ''}
            onChange={(e) =>
              setDialog((prev) => ({
                ...prev,
                supplier: prev.supplier ? { ...prev.supplier, email: e.target.value } : null,
              }))
            }
            margin="dense"
          />
          <TextField
            label="Điện thoại"
            fullWidth
            value={dialog.supplier?.phone || ''}
            onChange={(e) =>
              setDialog((prev) => ({
                ...prev,
                supplier: prev.supplier ? { ...prev.supplier, phone: e.target.value } : null,
              }))
            }
            margin="dense"
          />
          <TextField
            label="Mã số thuế"
            fullWidth
            value={dialog.supplier?.taxCode || ''}
            onChange={(e) =>
              setDialog((prev) => ({
                ...prev,
                supplier: prev.supplier ? { ...prev.supplier, taxCode: e.target.value } : null,
              }))
            }
            margin="dense"
          />
          <TextField
            label="Mô tả"
            fullWidth
            value={dialog.supplier?.description || ''}
            onChange={(e) =>
              setDialog((prev) => ({
                ...prev,
                supplier: prev.supplier ? { ...prev.supplier, description: e.target.value } : null,
              }))
            }
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog((prev) => ({ ...prev, open: false }))}>Hủy</Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierList;
