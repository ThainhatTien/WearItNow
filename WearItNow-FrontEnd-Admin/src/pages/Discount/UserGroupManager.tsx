import { Add, Delete, Edit } from '@mui/icons-material';
import {
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import {
    addUserGroup,
    deleteUserGroup,
    getUserGroups,
    updateUserGroup,
} from 'services/userGroupApi';
import { User, UserGroup } from 'types/DiscountTypes';
import UserGroupForm from './UserGroupForm';

const UserGroupManager: React.FC = () => {
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedUserGroup, setSelectedUserGroup] = useState<UserGroup | undefined>(undefined);
  const [expandedGroupId, setExpandedGroupId] = useState<number | null>(null);
  const [openUserEditDialog, setOpenUserEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [updatedUser, setUpdatedUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const data = await getUserGroups();
        setUserGroups(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu nhóm người dùng:', error);
      }
    };
    fetchUserGroups();
  }, []);

  const handleAddUserGroup = () => {
    setSelectedUserGroup(undefined);
    setOpenForm(true);
  };

  const handleEdit = (userGroup?: UserGroup, user?: User) => {
    if (userGroup) {
      setSelectedUserGroup(userGroup);
      setOpenForm(true);
    } else if (user) {
      setSelectedUser(user);
      setUpdatedUser({ ...user });
      setOpenUserEditDialog(true);
    }
  };

  const handleDeleteUserGroup = async (id: number) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa nhóm người dùng này?");
    if (!confirmed) return;

    try {
      await deleteUserGroup(id);
      setUserGroups(userGroups.filter((group) => group.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa nhóm người dùng:', error);
    }
  };

  const handleSaveUserGroup = async (userGroup: UserGroup) => {
    try {
      if (userGroup.id === 0) {
        await addUserGroup(userGroup.name);
      } else {
        await updateUserGroup(userGroup.id, userGroup.name);
      }
      setUserGroups((prevGroups) => {
        if (userGroup.id === 0) {
          return [...prevGroups, userGroup];
        } else {
          return prevGroups.map((group) =>
            group.id === userGroup.id ? { ...group, name: userGroup.name } : group
          );
        }
      });
      setOpenForm(false);
    } catch (error) {
      console.error('Lỗi khi lưu nhóm người dùng:', error);
    }
  };

  const handleExpandGroup = (id: number) => {
    setExpandedGroupId(expandedGroupId === id ? null : id);
  };

  const handleUserEditSave = () => {
    if (updatedUser) {
      setUserGroups((prev) =>
        prev.map((group) => ({
          ...group,
          users: group.users.map((user) =>
            user.userId === updatedUser.userId ? updatedUser : user
          ),
        }))
      );
      setOpenUserEditDialog(false);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddUserGroup}>
        Thêm nhóm người dùng
      </Button>
      <List>
        {userGroups.length > 0 ? (
          userGroups.map((userGroup) => (
            <div key={userGroup.id}>
              <ListItem>
                <ListItemText primary={userGroup.name} />
                <IconButton onClick={() => handleEdit(userGroup)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteUserGroup(userGroup.id)}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => handleExpandGroup(userGroup.id)}>
                  {expandedGroupId === userGroup.id ? '▲' : '▼'}
                </IconButton>
              </ListItem>
              <Collapse in={expandedGroupId === userGroup.id} timeout="auto" unmountOnExit>
                <List>
                  {userGroup.users.map((user) => (
                    <ListItem key={user.userId}>
                      <ListItemIcon>
                        <Typography>{user.username}</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={`UserId: ${user.userId}, Email: ${
                          user.email || 'Không có email'
                        }, Phone: ${user.phone || 'Không có số điện thoại'}`}
                      />
                      <IconButton onClick={() => handleEdit(undefined, user)}>
                        <Edit />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="Hiện chưa có nhóm người dùng nào" />
          </ListItem>
        )}
      </List>
      <UserGroupForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        userGroupToEdit={selectedUserGroup}
        onSave={handleSaveUserGroup}
      />
      <Dialog open={openUserEditDialog} onClose={() => setOpenUserEditDialog(false)}>
        <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={updatedUser?.username || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser!, username: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={updatedUser?.email || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser!, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            value={updatedUser?.phone || ''}
            onChange={(e) => setUpdatedUser({ ...updatedUser!, phone: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserEditDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleUserEditSave} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserGroupManager;
