import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, FormControl, MenuItem, Box } from '@mui/material';
import { colors, sizes } from 'data/colors';
import { useState, useEffect } from 'react';
import { Inventory } from 'types/ProductTypes';

interface InventoryEditFormProps {
  open: boolean;
  // inventoryData: Array<{ productInventoryId: number; productId: number; color: string; size: string; quantity: number }>;
  inventoryData: Inventory[];
  onClose: () => void;
  onSave: (data: Inventory) => void;
  productId: number;
}

const InventoryEditForm: React.FC<InventoryEditFormProps> = ({ open, onClose, inventoryData, onSave, productId }) => {
  const [editedData, setEditedData] = useState(inventoryData);
  const [openNewModal, setOpenNewModal] = useState(false);
  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newPurchasePrice, setNewPurchasePrice] = useState(0);
  const [newQuantity, setNewQuantity] = useState(0);


  useEffect(() => {
    setEditedData(inventoryData);  
  }, [inventoryData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const updatedData = [...editedData];
    updatedData[index] = { ...updatedData[index], [name]: value };
    setEditedData(updatedData);
  };

  const handleSave = () => {
    if (editedData.length > 0) {
      onSave(editedData[editedData.length - 1]);  // Chỉ gửi đối tượng cuối cùng (đối tượng mới thêm vào)
    }
    onClose(); // Đóng modal sau khi lưu
  };

  const handleOpenNewModal = () => {
    setOpenNewModal(true);
    // onClose();
  };
  const handleNewInventorySave = () => {
    const newInventoryItem: Inventory = {
      productId: productId,
      color: newColor,
      size: newSize,
      quantity: newQuantity,
      purchasePrice: newPurchasePrice,

    };

    // Thêm đối tượng mới vào mảng mà không thay đổi các phần tử khác
    const updatedData = [...editedData, newInventoryItem];
    setEditedData(updatedData);

    setOpenNewModal(false);  
  };

  const handleNewInventoryClose = () => {
    setOpenNewModal(false);
  };
  const handleColorChange = (event: any) => {
    setNewSize(event.target.value);
    setNewColor(event.target.value);
  };
  const handleSizeChange = (event: any) => {
    setNewSize(event.target.value);
  };
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Kho</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table aria-label="inventory table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '10%' }}>Màu sắc</TableCell>
                  <TableCell style={{ width: '10%' }}>Kích thước</TableCell>
                  <TableCell style={{ width: '10%' }}>Số lượng</TableCell>
                  <TableCell style={{ width: '25%' }}>Giá Nhập</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {editedData.map((item, index) => (
                  <TableRow key={item.inventoryId}>
                    <TableCell >
                      {/* Màu sắc */}
                      <div
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: item.color || '#ffffff',
                          border: '1px solid #ccc',
                        }}
                      />
                      {/* Tên hoặc thông tin khác */}
                      {/* <span style={{ fontSize: '14px', color: '#333' }}>{item.name}</span> */}
                    </TableCell>

                    <TableCell>
                      <TextField
                        value={item.size}
                        onChange={(e: any) => handleInputChange(e, index)}
                        name="size"
                        fullWidth
                        size="small"
                        InputProps={{ style: { fontSize: '14px', padding: '5px', } }}  // Giảm kích thước TextField
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.quantity}
                        onChange={(e: any) => handleInputChange(e, index)}
                        name="quantity"
                        fullWidth
                        type="number"
                        size="small"
                        InputProps={{ style: { fontSize: '14px', padding: '5px' } }}  // Giảm kích thước TextField
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={item.purchasePrice}
                        onChange={(e: any) => handleInputChange(e, index)}
                        name="purchasePrice"
                        fullWidth
                        type="number"
                        size="small"
                        InputProps={{ style: { fontSize: '14px', padding: '5px' } }}  // Giảm kích thước TextField
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Hủy</Button>
          <Button onClick={handleSave} color="primary">Lưu</Button>
          <Button onClick={handleOpenNewModal} color="primary">Tạo Mới</Button>
        </DialogActions>
      </Dialog>

      {/* Modal thêm mới inventory */}
      <Dialog open={openNewModal} onClose={handleNewInventoryClose} maxWidth="sm" >
        <DialogTitle>Thêm Mới Kho</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            {/* Chọn Màu */}
            <Grid item xs={3}>
              <FormControl fullWidth margin="dense">
                <TextField
                  select
                  value={newColor || ""}
                  onChange={handleColorChange}
                  label="Chọn Màu"
                  size='small'
                  SelectProps={{
                    displayEmpty: true,
                  }}
                >
                  <MenuItem value="" disabled>
                    Chọn màu..
                  </MenuItem>
                  {colors.map((color) => (
                    <MenuItem key={color.hex} value={color.name}>
                      <Box
                        sx={{
                          display: 'flex', // Đặt các phần tử theo hàng ngang
                          justifyContent: 'space-between', // Phân chia các phần tử sang hai bên
                          width: '100%', // Đảm bảo MenuItem có độ rộng đầy đủ
                          alignItems: 'center', // Căn giữa các phần tử theo chiều dọc
                        }}
                      >
                        {/* Ô màu bên trái */}
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: color.name,
                            borderRadius: '50%',
                            marginRight: 1, // Khoảng cách giữa ô màu và mã màu
                          }}
                        />
                        {/* Mã màu bên phải */}
                        {color.name}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            {/* Chọn Size */}
            <Grid item xs={3}>
              <FormControl fullWidth margin="dense">
                <TextField
                  select
                  value={newSize || ""}
                  onChange={handleSizeChange}
                  label="Chọn Size"
                  size='small'
                  SelectProps={{
                    displayEmpty: true,
                  }}
                >
                  <MenuItem value="" disabled>
                    Chọn Size..
                  </MenuItem>
                  {sizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            {/* Nhập Số Lượng */}
            <Grid item xs={3}>
              <FormControl fullWidth margin="dense">
                <TextField
                  id="quantity-input"
                  type="number"
                  size='small'
                  label="Số Lượng"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  inputProps={{
                    min: 0, // Đảm bảo không nhập số âm
                  }}
                />
              </FormControl>
            </Grid>

            {/* Nhập Số Lượng */}
            <Grid item xs={3}>
              <FormControl fullWidth margin="dense">
                <TextField
                  // id="quantity-input"
                  type="number"
                  size='small'
                  label="Giá Nhập"
                  value={newQuantity}
                  onChange={(e) => setNewPurchasePrice(Number(e.target.value))}
                  inputProps={{
                    min: 10000, // Đảm bảo không nhập số âm
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>



        <DialogActions>
          <Button onClick={handleNewInventoryClose} color="secondary">Hủy</Button>
          <Button onClick={handleNewInventorySave} color="primary">Thêm Mới</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InventoryEditForm;
