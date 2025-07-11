import { useEffect, useState } from 'react';
import { Card, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Checkbox, Stack, Typography, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Role, Permission } from '../../types/User.type';
import { fetchRoles } from 'store/Role/RoleAction';
import { fetchPermissions } from 'store/AuthenticationAction/PermissionAction';
import { AppDispatch } from 'store';
import { postPermission_rolesService, postPermissionService } from 'services/ApiRole';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import IconifyIcon from 'components/base/IconifyIcon';

const PermissionTable = () => {
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });
    const dispatch = useDispatch<AppDispatch>();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const { roleData } = useSelector((state: any) => state.role);
    const [newPermission, setNewPermission] = useState<string>(''); // For new permission
    const { permissionData } = useSelector((state: any) => state.permission);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        dispatch(fetchRoles());
        dispatch(fetchPermissions());
    }, [dispatch]);

    const handlePermissionChange = async (role: Role, permissionName: string, checked: boolean) => {
        const updatedPermissions = checked
            ? [...role.permissions.map((p) => p.name), permissionName]
            : role.permissions.map((p) => p.name).filter((p) => p !== permissionName);

        try {
            await postPermission_rolesService(role.name, updatedPermissions);
            enqueueSnackbar('Cập nhật quyền thành công!', { variant: 'success' });
            dispatch(fetchRoles());
        } catch (error) {
            enqueueSnackbar('Lỗi khi cập nhật quyền cho vai trò', { variant: 'error' });
        }
    };
    const handleAddPermission = async() => {
      if (!newPermission) {
            enqueueSnackbar('Tên quyền không được để trống!', { variant: 'error' });
            return;
        }

        try {
            await postPermissionService({ name: newPermission, description: '' });
            enqueueSnackbar('Thêm quyền thành công!', { variant: 'success' });
            dispatch(fetchPermissions()); // Refresh permissions after adding new permission
            setIsAddModalVisible(false);
        } catch (error) {
            enqueueSnackbar('Thêm quyền thất bại!', { variant: 'error' });
        }
    };
    

    const columns = [
        { field: 'name', headerName: 'Vai Trò', flex: 1 },
        ...permissionData.map((permission: Permission) => ({
            field: permission.name,
            headerName: permission.name,
            renderCell: (params: any) => (
                <Checkbox
                    checked={params.row.permissions.some((p: Permission) => p.name === permission.name)}
                    onChange={(e) => handlePermissionChange(params.row, permission.name, e.target.checked)}
                />
            ),
            flex: 1,
        })),
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5} flexWrap="wrap" gap={3}>
                    <Typography variant="h4"color="common.white">Phân  Quyền</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size= "small"
                        onClick={() => setIsAddModalVisible(true)} // Mở modal
                        startIcon={<IconifyIcon icon="akar-icons:plus" />}
                    >
                        Thêm Quyền
                    </Button>
                </Stack>
            <Card sx={{ padding: 2 }}>
                <DataGrid
                    rows={roleData}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    autoHeight
                    getRowId={(row) => row.name}
                />
            </Card>
            </Paper>
            <Dialog open={isAddModalVisible} onClose={() => setIsAddModalVisible(false)}>
                <DialogTitle>Thêm Quyền</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Tên Quyền"
                        type="text"
                        fullWidth
                        value={newPermission} // Bind the input value to the state
                        onChange={(e) => setNewPermission(e.target.value)} // Update state on change
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsAddModalVisible(false)} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleAddPermission} color="primary">
                        Thêm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PermissionTable;
