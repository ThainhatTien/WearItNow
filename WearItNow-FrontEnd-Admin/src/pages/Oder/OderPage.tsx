import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useOrderContext } from 'pages/Oder/OrderContext';
import PaginationActions from 'pages/Oder/PaginationActions';
import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from 'types/orderTypes';
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'decimal', maximumFractionDigits: 0 }).format(value);
const formatDate = (date: string) => {
  return format(new Date(date), 'dd/MM/yyyy');
};
const getPaymentStatusColor = (paymentStatus: string) => {
  switch (paymentStatus) {
    case 'Paid':
      return 'success';
    case 'UNPAID':
      return 'warning';
    case 'PAIDBYCASH':
      return 'info';
    case 'Failed':
      return 'error';
    default:
      return 'default';
  }
};

const getOrderStatusLabel = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'Đang chờ xử lý';
    case OrderStatus.CANCELED:
      return 'Đã hủy';
    case OrderStatus.SHIPPED:
      return 'Đang vận chuyển';
    case OrderStatus.CONFIRMED:
      return 'Đã xác nhận';
    case OrderStatus.DELIVERED:
      return 'Đã giao';
    default:
      return 'Tất cả';
  }
};

const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'default';
    case OrderStatus.CANCELED:
      return 'error';
    case OrderStatus.SHIPPED:
      return 'primary';
    case OrderStatus.CONFIRMED:
      return 'warning';
    default:
      return 'success';
  }
};
const OrderPage = () => {
  const {
    orders,
    currentPage,
    pageSize,
    totalElements,
    handlePageChange,
    handleRowsPerPageChange,
    setOrderCode,
    setStatus,
    setMinTotalAmount,
    setMaxTotalAmount,
    updateOrderStatus,
    sortOrder,
    setSortOrder,
  } = useOrderContext();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatedOrder, setUpdatedOrder] = useState<Order | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const handleViewDetails = (order: Order) => setSelectedOrder(order);
  const handleCloseModal = () => setSelectedOrder(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>
    setOrderCode(event.target.value);

  const handleUpdateOrder = async (order: Order) => {
    try {
      if (order) {
        await updateOrderStatus(order.orderId?.toString() || '', order.status || '');
        setUpdatedOrder(null);
      }
    } catch (error) {
      error('Lỗi khi cập nhật đơn hàng:', error);
    }
  };

  const handleStatusChange = (status: OrderStatus) => {
    setFilterStatus(status); // Cập nhật trạng thái bộ lọc
    setStatus(status === OrderStatus.ALL ? '' : status);
  };

  const handleMinTotalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMinTotalAmount(value ? parseInt(value) : undefined);
  };

  const handleMaxTotalAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMaxTotalAmount(value ? parseInt(value) : undefined);
  };

  const handleSortOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder(event.target.value as 'newest' | 'oldest');
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.75rem' }}>
        Danh Sách Đơn Hàng
      </Typography>

      {/* Bộ lọc */}
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Grid container spacing={2}>
          {/* Tìm kiếm */}
          <Grid item xs={12} sm={2}>
            <TextField
              label="Tìm kiếm theo Mã Đơn Hàng"
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleSearch}
            />
          </Grid>

          {/* Tổng Tiền Từ */}
          <Grid item xs={12} sm={2}>
            <TextField
              label="Tổng Tiền Từ (VND)"
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              onChange={handleMinTotalAmountChange}
            />
          </Grid>

          {/* Tổng Tiền Đến */}
          <Grid item xs={12} sm={2}>
            <TextField
              label="Tổng Tiền Đến (VND)"
              variant="outlined"
              size="small"
              fullWidth
              type="number"
              onChange={handleMaxTotalAmountChange}
            />
          </Grid>
          {/* Bộ lọc Trạng Thái */}
          <Grid item xs={12} sm={2}>
            <TextField
              label="Chọn Trạng Thái"
              variant="outlined"
              size="small"
              fullWidth
              select
              value={filterStatus}
              onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            >
              <MenuItem value={OrderStatus.ALL}>{getOrderStatusLabel(OrderStatus.ALL)}</MenuItem>
              {Object.values(OrderStatus)
                .filter((status) => status !== OrderStatus.ALL)
                .map((status) => (
                  <MenuItem key={status} value={status}>
                    {getOrderStatusLabel(status)}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          {/* Bộ lọc Sắp Xếp */}
          <Grid item xs={12} sm={2}>
            <TextField
              label="Sắp Xếp Theo Ngày"
              variant="outlined"
              size="small"
              fullWidth
              select
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <MenuItem value="newest">Mới Nhất</MenuItem>
              <MenuItem value="oldest">Cũ Nhất</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {/* Cột bảng với font đậm để tạo sự phân biệt */}
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Mã Đơn Hàng
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Tổng Tiền
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Trạng Thái đơn hàng
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Trạng Thái Thanh Toán
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Thời gian đặt hàng
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Chi Tiết
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', minWidth: '120px' }}>
                Cập Nhật
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.orderId}>
                {/* Mã đơn hàng */}
                <TableCell align="center">{order.order_code}</TableCell>

                {/* Tổng tiền */}
                <TableCell align="center">{formatCurrency(order.totalAmount)} đ</TableCell>

                {/* Trạng thái đơn hàng */}
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          lineHeight: '40px', // Căn giữa văn bản theo chiều dọc
                        }}
                      >
                        {getOrderStatusLabel(order.status)}
                      </Typography>
                    }
                    color={getOrderStatusColor(order.status)}
                    sx={{
                      height: '40px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                </TableCell>

                {/* Trạng thái thanh toán */}
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          lineHeight: '40px', // Căn giữa văn bản theo chiều dọc
                        }}
                      >
                        {order.payment_status}
                      </Typography>
                    }
                    color={getPaymentStatusColor(order.payment_status)} // Lấy màu cho trạng thái thanh toán
                    sx={{
                      height: '40px',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  />
                </TableCell>

                {/* Ngày giao dự kiến */}
                <TableCell align="center">{formatDate(order.expected_delivery_time)}</TableCell>

                {/* Nút Xem Chi Tiết */}
                <TableCell align="center">
                  <Button
                    size="small"
                    color="primary"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'none',
                      minWidth: '120px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => handleViewDetails(order)}
                  >
                    Xem Chi Tiết
                  </Button>
                </TableCell>

                {/* Nút Cập Nhật */}
                <TableCell align="center">
                  <Button
                    size="small"
                    color="secondary"
                    sx={{
                      fontWeight: 'bold',
                      textTransform: 'none',
                      minWidth: '120px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onClick={() => setUpdatedOrder(order)}
                  >
                    Cập Nhật
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalElements}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleRowsPerPageChange}
        ActionsComponent={(props) => <PaginationActions {...props} />}
        labelDisplayedRows={({ from, to, count }) => `Từ ${from} đến ${to} trong ${count}`}
        sx={{ fontSize: '0.875rem', height: '36px' }}
      />

      <OrderDetailDialog order={selectedOrder} onClose={handleCloseModal} />
      <OrderUpdateDialog
        order={updatedOrder}
        setOrder={setUpdatedOrder}
        onSave={handleUpdateOrder}
      />

    </div>
  );
};

const OrderDetailDialog: React.FC<{ order: Order | null; onClose: () => void }> = ({
  order,
  onClose,
}) => (
  <Dialog open={!!order} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
      Chi Tiết Đơn Hàng #{order?.order_code}
    </DialogTitle>
    <DialogContent dividers sx={{ padding: 2 }}>
      {order ? (
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
              <TableCell sx={{ width: '40%', fontSize: '15px' }}>
                <strong>Mã Đơn Hàng</strong>
              </TableCell>
              <TableCell>{order.order_code}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Trạng Thái</strong>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={getOrderStatusLabel(order.status)}
                  color={getOrderStatusColor(order.status)}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tổng Tiền</strong>
              </TableCell>
              <TableCell>{formatCurrency(order.totalAmount)} VND</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Phí Vận Chuyển</strong>
              </TableCell>
              <TableCell>{formatCurrency(order.shippingFee || 0)} VND</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giảm Giá</strong>
              </TableCell>
              <TableCell>{formatCurrency(order.discountAmount || 0)} VND</TableCell>
            </TableRow>

            {/* Phân cách */}
            <TableRow>
              <TableCell
                colSpan={2}
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '2rem',
                  color: '#cccccc', // Cùng màu sắc
                  paddingTop: '16px',
                }}
              >
                Chi Tiết Sản Phẩm
              </TableCell>
            </TableRow>

            {/* Chi Tiết Sản Phẩm */}
            <TableRow>
              <TableCell colSpan={2}>
                <Box
                  sx={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: 1,
                    backgroundColor: '#050505',
                    color: '#050505',
                  }}
                >
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
                          <TableCell>{formatCurrency(detail.price)} VND</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <Typography>Không có thông tin đơn hàng.</Typography>
      )}
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', padding: '16px' }}>
      <Button
        onClick={onClose}
        color="primary"
        variant="contained"
        size="large"
        sx={{ fontWeight: 'bold', textTransform: 'none' }}
      >
        Đóng
      </Button>
    </DialogActions>
  </Dialog>
);

const OrderUpdateDialog: React.FC<{
  order: Order | null;
  setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  onSave: (order: Order) => Promise<void>;
}> = ({ order, setOrder, onSave }) => {
  const [status, setStatus] = useState<OrderStatus | string>('');
  const { enqueueSnackbar } = useSnackbar(); // Dùng `enqueueSnackbar` để hiển thị thông báo

  useEffect(() => {
    if (order) {
      setStatus(order.status); // Đảm bảo giá trị ban đầu là trạng thái hiện tại của đơn hàng
    }
  }, [order]);

  const isValidStatusChange = (currentStatus: string, newStatus: string): boolean => {
    const statusOrder: Record<string, number> = {
      [OrderStatus.PENDING]: 1,
      [OrderStatus.CONFIRMED]: 2,
      [OrderStatus.SHIPPED]: 3,
      [OrderStatus.DELIVERED]: 4,
      [OrderStatus.CANCELED]: 5,
    };

    const currentStatusOrder = statusOrder[currentStatus];
    const newStatusOrder = statusOrder[newStatus];

    return newStatusOrder > currentStatusOrder; // Đảm bảo trạng thái mới tiến về phía trước trong chuỗi
  };

  const handleSave = async () => {
    if (order) {
      try {
        await onSave(order); // Lưu đơn hàng
        setOrder(null); // Đóng modal sau khi lưu thành công
        enqueueSnackbar('Cập nhật đơn hàng thành công!', { variant: 'success' }); // Thông báo thành công
      } catch (error) {
        console.error('Lỗi khi cập nhật đơn hàng:', error);
        enqueueSnackbar('Cập nhật đơn hàng thất bại!', { variant: 'error' }); // Thông báo thất bạiiii
      }
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    if (order && isValidStatusChange(order.status, e.target.value as string)) {
        setOrder((prev) => (prev ? { ...prev, status: e.target.value as OrderStatus } : null));
    } else {
      enqueueSnackbar('Bạn không thể chỉnh sửa về trạng thái cũ.', { variant: 'warning' }); // Thông báo cảnh báo
    }
  };

  return (
    <Dialog open={!!order} onClose={() => setOrder(null)} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
        Cập Nhật Đơn Hàng #{order?.order_code}
      </DialogTitle>
      <DialogContent dividers sx={{ padding: 2 }}>
        {order && (
          <form>
            <TextField
              label="Tổng Tiền"
              value={order.totalAmount || ''}
              fullWidth
              margin="normal"
              type="number"
              required
              disabled
            />
            <TextField
              label="Trạng Thái"
              select
              value={status}
              onChange={handleStatusChange}
              fullWidth
              margin="normal"
              disabled={order.status === OrderStatus.CANCELED}
            >
              {Object.values(OrderStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {getOrderStatusLabel(status)}
                </MenuItem>
              ))}
            </TextField>
          </form>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px', justifyContent: 'space-between' }}>
        <Button onClick={() => setOrder(null)} color="inherit" sx={{ fontWeight: 'bold' }}>
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          sx={{ fontWeight: 'bold' }}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};


export default OrderPage;
