import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getusermyInfo } from 'store/User/UserAction';
import { Avatar, Box, Button, Grid, Paper, TextField, Typography, List, ListItem, ListItemText, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { grey } from '@mui/material/colors';
import useNotifications from 'layouts/main-layout/Topbar/hook/NotificationHook';

const ProfilePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userMyInfo, loading, error } = useSelector((state: RootState) => state.userData);
  const [activeTab, setActiveTab] = useState<'profile' | 'notification'>('profile'); // Quản lý tab hiện tại

  // Gọi hook useNotifications để lấy thông báo
  const { notifications, loading: notificationsLoading, error: notificationsError, handleNotificationClick } = useNotifications();

  useEffect(() => {
    dispatch(getusermyInfo());
  }, [dispatch]);

  if (loading) return <div>Đang tải thông tin...</div>;
  if (error) return <div>{error}</div>;

  const handleSave = () => {
    // Remove console.log statement
    // Save user information logic here
  };

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1, borderRadius: '12px' }}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: '20%',
            minWidth: 250,
            maxWidth: 300,
            padding: 3,
            backgroundColor: grey[600],
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={userMyInfo?.username || '/default-avatar.png'}
              sx={{ width: 80, height: 80, backgroundColor: grey[300] }}
            />
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              {userMyInfo?.username}
            </Typography>
          </Box>
          {/* Menu */}
          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant={activeTab === 'profile' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('profile')}
              sx={{
                mb: 1,
                textTransform: 'none',
                color: activeTab === 'profile' ? 'white' : grey[900],
                backgroundColor: activeTab === 'profile' ? '#D4EED6' : 'transparent',
                '&:hover': { backgroundColor: activeTab === 'profile' ? '#BBDAB8' : grey[300] },
              }}
            >
              Hồ sơ
            </Button>
            <Button
              fullWidth
              variant={activeTab === 'notification' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('notification')}
              sx={{
                mb: 1,
                textTransform: 'none',
                color: activeTab === 'notification' ? 'white' : grey[900],
                backgroundColor: activeTab === 'notification' ? '#D4EED6' : 'transparent',
                '&:hover': { backgroundColor: activeTab === 'notification' ? '#BBDAB8' : grey[300] },
              }}
            >
              Thông Báo
            </Button>
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, padding: 4, overflowY: 'auto' }}>
          {activeTab === 'profile' && (
            <>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
                Chỉnh Sửa Hồ Sơ
              </Typography>
              {/* Nội dung chỉnh sửa hồ sơ */}
              <Grid container spacing={3} sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
                {/* Username */}
                <Grid item xs={12}>
                  <TextField
                    label="Username"
                    defaultValue={userMyInfo?.username}
                    fullWidth
                    size='small'
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Họ và Tên */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Họ"
                    defaultValue={userMyInfo?.firstname}
                    fullWidth
                    size='small'
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tên"
                    defaultValue={userMyInfo?.lastname}
                    fullWidth
                    size='small'
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* SĐT */}
                <Grid item xs={12}>
                  <TextField
                    label="Số điện thoại"
                    defaultValue={userMyInfo?.phone}
                    fullWidth
                    size='small'
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    defaultValue={userMyInfo?.email}
                    fullWidth
                    size='small'
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {/* birthday */}
                <Grid item xs={12}>
                  <TextField
                    label="Ngày sinh"
                    defaultValue={userMyInfo?.dob}
                    fullWidth
                    size='small'
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                {/* Gender */}
                <Grid item xs={12}>
                  <Box>
                    <label>{userMyInfo?.gender}</label>
                    <RadioGroup
                      value={userMyInfo?.gender ? 'Nam' : 'Nữ'}
                      // onChange={(e) => setFieldValue('gender', e.target.value === 'Nam')}
                      row
                    >
                      <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                      <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                    </RadioGroup>
                  </Box>
                </Grid>
                {/* Nút Lưu */}
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      backgroundColor: '#F47B7B',
                      color: 'white',
                      textTransform: 'none',
                      fontSize: 16,
                      padding: '8px 24px',
                      borderRadius: '8px',
                      '&:hover': { backgroundColor: '#E86666' },
                    }}
                  >
                    Lưu
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
          {activeTab === 'notification' && (
            <>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
                Thông Báo
              </Typography>
              <Box>
                {notificationsLoading ? (
                  <Typography variant="body1">Đang tải thông báo...</Typography>
                ) : notificationsError ? (
                  <Typography variant="body1" color="error">
                    {notificationsError}
                  </Typography>
                ) : notifications.length === 0 ? (
                  <Typography variant="body1">Bạn không có thông báo nào.</Typography>
                ) : (
                  <List>
                    {notifications.map((notification) => (
                      <ListItem button key={notification.id} onClick={() => handleNotificationClick(notification)}>
                        <ListItemText primary={notification.message} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfilePage;
