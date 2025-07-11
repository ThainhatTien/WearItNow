import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { addUserGroup, updateUserGroup } from 'services/userGroupApi';
import { UserGroup } from 'types/DiscountTypes'; // Đảm bảo kiểu này là đúng
interface UserGroupFormProps {
    open: boolean;
    onClose: () => void;
    userGroupToEdit?: UserGroup;
    onSave: (userGroup: UserGroup) => void; // Chỉ nhận UserGroup
  }
  
  const UserGroupForm: React.FC<UserGroupFormProps> = ({ open, onClose, userGroupToEdit, onSave }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      if (userGroupToEdit) {
        setName(userGroupToEdit.name);
      }
    }, [userGroupToEdit]);
  
    const handleSave = async () => {
      setLoading(true);
      setError(null);
      try {
        let updatedGroup;
        if (userGroupToEdit) {
          // Cập nhật nhóm người dùng
          updatedGroup = await updateUserGroup(userGroupToEdit.id, name);
        } else {
          // Thêm nhóm người dùng mới
          updatedGroup = await addUserGroup(name);
        }
        onSave(updatedGroup); // Trả về nhóm người dùng đã thêm/cập nhật
        onClose(); // Đóng form sau khi lưu
      } catch (error) {
        console.error("Lỗi khi lưu nhóm người dùng:", error);
        setError('Có lỗi xảy ra khi lưu nhóm người dùng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{userGroupToEdit ? 'Sửa nhóm người dùng' : 'Thêm nhóm người dùng'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên nhóm"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSave} color="primary" disabled={loading || !name}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default UserGroupForm;
  