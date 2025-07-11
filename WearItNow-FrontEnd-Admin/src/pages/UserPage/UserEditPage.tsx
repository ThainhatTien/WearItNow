import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText } from '@mui/material';
import { Role, UserType } from 'types/User.type';
import Splash from 'components/loading/Splash';
import { message } from 'antd';
import { useFormValidation } from 'ValidateForm/useFormValidation';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  editedUser: UserType;
  setEditedUser: (user: UserType) => void;
  roleData: Role[];
  onSave: () => void;
  loading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, editedUser, setEditedUser, roleData, onSave, loading }) => {
  const labels = {
    firstname: 'Tên',
    lastname: 'Họ',
    email: 'Email',
    phone: 'Số điện thoại',
    username: 'Tên tài khoản',
    password: 'Mật khẩu',
    dob: 'Ngày sinh',
    gender: 'Giới tính',
  };

  // Các trường nhập liệu cho user
  const formFields = [
    { field: 'username', value: editedUser.username, rules: { required: true } },
    { field: 'firstname', value: editedUser.firstname, rules: { required: true } },
    { field: 'lastname', value: editedUser.lastname, rules: { required: true } },
    { field: 'email', value: editedUser.email, rules: { required: true, pattern: /^[^@]+@[^@]+\.[^@]+$/ } },
    { field: 'phone', value: editedUser.phone, rules: { required: true, pattern: /^[0-9]{10}$/ } },
    { field: 'roles', value: editedUser.roles, rules: { required: true } },
  ];

  const { errors, validate } = useFormValidation(formFields);

  const handleSave = () => {
    const validationErrors = validate(formFields, labels);

    if (Object.keys(validationErrors).length === 0) {
      onSave();
    } else {
      message.error('Thiếu trường dữ liệu vui lòng nhập');
    }
  };

  useEffect(() => {
    // Reset errors khi modal được mở lại
    if (open) {
      validate(formFields, labels); // Kiểm tra lại hợp lệ mỗi khi mở modal
    }
  }, [open, validate]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>

      <DialogContent>
        {loading ? (
          <Splash />
        ) : (
          <>
            {/* Các trường nhập liệu cho user */}
            {[
              { label: 'Username', value: 'username' },
              { label: 'First Name', value: 'firstname' },
              { label: 'Last Name', value: 'lastname' },
              { label: 'Email', value: 'email', type: 'email' },
              { label: 'Phone', value: 'phone' },
              // { label: 'Password', value: 'password', type: 'password' }
            ].map((field) => (
              <TextField
                key={field.value}
                autoFocus={field.value === 'firstname'}
                margin="dense"
                label={field.label}
                type={field.type || 'text'}
                fullWidth
                value={editedUser ? (editedUser as any)[field.value] : ''}
                onChange={(e) => setEditedUser({ ...editedUser, [field.value]: e.target.value })}
                error={!!errors[field.value]}
                helperText={errors[field.value]}
              />
            ))}

            <FormControl fullWidth margin="dense">
              <InputLabel>Roles</InputLabel>
              <Select
                multiple
                value={editedUser.roles.map((role) => (typeof role === 'string' ? role : role.name))}
                onChange={(event) => {
                  const selectedRoles = event.target.value as string[];
                  setEditedUser({
                    ...editedUser,
                    roles: selectedRoles.map((name) => ({
                      name,
                      description: '',
                      permissions: [],
                    })),
                  });
                }}
                renderValue={(selected) => selected.join(', ')}
                error={!!errors.roles}
              >
                {roleData.map((role: Role) => (
                  <MenuItem key={role.name} value={role.name}>
                    <Checkbox
                      checked={editedUser.roles.some(
                        (r) => (typeof r === 'string' ? r : r.name) === role.name
                      )}
                    />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
              {errors.roles && <div style={{ color: 'red', fontSize: '12px' }}>{errors.roles}</div>}
            </FormControl>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserModal;
