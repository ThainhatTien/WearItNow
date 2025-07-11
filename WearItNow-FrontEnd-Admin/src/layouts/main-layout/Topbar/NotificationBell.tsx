import React, { useState } from 'react';
import { Badge, Menu, MenuItem, Typography, IconButton, Dialog, DialogTitle, DialogContent, Button, TableRow, TableCell, TableBody, TableHead, Table, Box, Chip } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import useNotifications from './hook/NotificationHook';


const NotificationBadge = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    loading,
    error,
    handleNotificationClick,
    displayedNotifications,
    unreadNotifications,
    showAllNotifications,
    setShowAllNotifications,
    selectedNotification,
    orderDetails,
    handleConfirmOrder,
    handleCloseModal,
  } = useNotifications();

  // Mở menu thông báo
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu thông báo
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Badge
        color="error"
        badgeContent={unreadNotifications.length > 0 ? unreadNotifications.length : undefined}
        sx={{ '& .MuiBadge-badge': { top: 8, right: 8 } }}
      >
        <IconButton onClick={handleClick} color="inherit">
          <Notifications />
        </IconButton>
      </Badge>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ marginTop: 1 }}
      >
        {loading ? (
          <MenuItem><Typography variant="body2">Đang tải thông báo...</Typography></MenuItem>
        ) : error ? (
          <MenuItem><Typography variant="body2" color="error">{error}</Typography></MenuItem>
        ) : displayedNotifications.length > 0 ? (
          displayedNotifications.map((notification) => (
            <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}>
              <Typography variant="body2">{notification.message}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleCloseMenu}><Typography variant="body2">Không có thông báo mới</Typography></MenuItem>
        )}
        {!showAllNotifications && unreadNotifications.length > 4 && (
          <MenuItem onClick={() => setShowAllNotifications(true)}>
            <Typography variant="body2" color="primary">Xem thêm</Typography>
          </MenuItem>
        )}
      </Menu>

      {/* Modal hiển thị chi tiết thông báo */}
      <Dialog open={!!selectedNotification} onClose={handleCloseModal}>
        <DialogTitle>Chi tiết thông báo</DialogTitle>
        <DialogContent>
          {selectedNotification ? (
            <>
              {orderDetails && orderDetails.length > 0 && orderDetails.map((order, index) => (
                <div key={index}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '2rem', // Cùng kích thước font
                            color: '#cccccc', // Cùng màu sắc
                          }}
                        >
                          Thông Tin Đơn Hàng
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Thông Tin Đơn Hàng */}
                      <TableRow>
                        <TableCell sx={{ width: '40%', fontSize: '15px' }}><strong>Mã Đơn Hàng</strong></TableCell>
                        <TableCell>{order.order_code}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Trạng Thái</strong></TableCell>
                        <TableCell><Chip size="small" label={order.status} /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Tổng Tiền</strong></TableCell>
                        <TableCell>{order.totalAmount} VND</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Phí Vận Chuyển</strong></TableCell>
                        <TableCell>{order.shippingFee || 0} VND</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Giảm Giá</strong></TableCell>
                        <TableCell>{order.discountAmount || 0} VND</TableCell>
                      </TableRow>

                      {/* Chi Tiết Sản Phẩm */}
                      <TableRow>
                        <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '2rem', color: '#cccccc' }}>
                          Chi Tiết Sản Phẩm
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Box sx={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '4px', padding: 1 }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Tên Sản Phẩm</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Màu Sắc</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Số Lượng</TableCell>
                                  <TableCell sx={{ fontWeight: 'bold' }}>Giá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {order?.orderDetails?.map((detail, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{detail.name}</TableCell>
                                    <TableCell>{detail.color || 'Chưa có màu sắc'}</TableCell>
                                    <TableCell>{detail.quantity}</TableCell>
                                    <TableCell>{detail.price} VND</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Button variant="contained" color="primary" onClick={() => handleConfirmOrder(order.orderId)}>
                    Xác nhận đơn hàng
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <Typography variant="body2">Không có thông tin chi tiết</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationBadge;
