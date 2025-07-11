import { Menu, Avatar, Button, Tooltip, MenuItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { useState, MouseEvent, useCallback, ReactElement, useEffect } from 'react';
import userMenuItems from 'data/usermenu-items';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { LogoutApi } from 'services/ApiLogin';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { stringAvatar } from 'helpers/string-avatar';
import { getusermyInfo } from 'store/User/UserAction';

const UserDropdown = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const { userMyInfo } = useSelector((state: RootState) => state.userData);
  const navigate = useNavigate(); // Khởi tạo useNavigate1

  const dispatch: AppDispatch = useDispatch();
  const handleUserClick = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  useEffect(() => {
    dispatch(getusermyInfo());
}, [dispatch]);

  const handleUserClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    await LogoutApi(token)
    localStorage.clear();
    navigate('/authentication/login'); 
  };

  return (
    <>
    {userMyInfo ? (
      <Button
        color="inherit"
        variant="text"
        id="account-dropdown-menu"
        aria-controls={menuOpen ? 'account-dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
        onClick={handleUserClick}
        disableRipple
        sx={{
          borderRadius: 2,
          gap: 3.75,
          px: { xs: 0, sm: 0.625 },
          py: 0.625,
          '&:hover': {
            bgcolor: 'transparent',
          },
        }}
      >
        <Tooltip title={userMyInfo.firstname} arrow placement="bottom">
        <Avatar {...stringAvatar(`${userMyInfo.firstname} ${userMyInfo.lastname}`)} />
        </Tooltip>
        <IconifyIcon
          color="common.white"
          icon="mingcute:down-fill"
          width={22.5}
          height={22.5}
          sx={(theme) => ({
            transform: menuOpen ? `rotate(180deg)` : `rotate(0deg)`,
            transition: theme.transitions.create('all', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.short,
            }),
          })}
        />
      </Button>
    ) : (
      <Typography variant="h6" color="text.secondary">
        Không có thông tin người dùng.
      </Typography>
    )}
  
    <Menu
      id="account-dropdown-menu"
      anchorEl={anchorEl}
      open={menuOpen}
      onClose={handleUserClose}
      MenuListProps={{
        'aria-labelledby': 'account-dropdown-button',
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {userMenuItems.map((userMenuItem) => (
        <MenuItem 
          key={userMenuItem.id} 
          onClick={userMenuItem.title === 'Logout' ? handleLogout : handleUserClose}
          component={userMenuItem.title === 'Logout' ? 'div' : Link} 
          to={userMenuItem.path}
        >
          <ListItemIcon
            sx={{
              minWidth: `0 !important`,
              color: userMenuItem.color,
              width: 14,
              height: 10,
              mb: 1.5,
            }}
          >
            <IconifyIcon icon={userMenuItem.icon} color={userMenuItem.color} />
          </ListItemIcon>
          <ListItemText
            sx={(theme) => ({
              color: userMenuItem.color,
              '& .MuiListItemText-primary': {
                fontSize: theme.typography.subtitle2.fontSize,
                fontFamily: theme.typography.subtitle2.fontFamily,
                fontWeight: theme.typography.subtitle2.fontWeight,
              },
            })}
          >
            {userMenuItem.title}
          </ListItemText>
        </MenuItem>
      ))}
    </Menu>
  </>
  
  );
};

export default UserDropdown;
