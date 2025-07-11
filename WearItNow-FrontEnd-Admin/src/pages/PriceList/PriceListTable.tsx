import { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  Button,
  FormControl,
  Tooltip,
  Fab,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import { PriceList, ProductPrice } from 'types/PriceList';
import {
  addPriceList,
  addProductPrice,
  deletePriceList,
  deleteProductPrice,
  fetchOneProductPrice,
  fetchPriceLists,
  updateProductPriceAction,
} from 'store/PriceList/PriceListAction';
import { AddCircleOutline } from '@mui/icons-material';
import AddPriceListForm from './AddPriceList';
import AddPriceProductForm from './AddPriceProduct';
import { fetchProductsBySearch } from 'store/Product/ProductAction';
import { debounce } from 'lodash';
import { Product } from 'types/ProductTypes';
import UpdatePriceProductForm from './UpdatePriceProduct';

const PriceListTable = () => {
  const dispatch: AppDispatch = useDispatch();
  const { priceLists, loading, error } = useSelector((state: RootState) => state.priceList);
  const { productPrices } = useSelector((state: RootState) => state.producPriceData);
  const { products, productPageSize, productCurrentPage } = useSelector(
    (state: any) => state.productData,
  );
  const [searchName] = useState<string>('');
  const [selectedPriceList, setSelectedPriceList] = useState<PriceList | null>(null);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [selectedPriceProduct, setSelectedPriceProduct] = useState<ProductPrice>();
  const [showProductPriceTable, setShowProductPriceTable] = useState(false);
  const [openAddPriceModal, setOpenAddPriceModal] = useState(false);
  const [openAddPriceProductModal, setOpenAddPriceProductModal] = useState(false);

  useEffect(() => {
    dispatch(fetchPriceLists());
    const fetchProducts = () => {
      dispatch(fetchProductsBySearch(searchParams));
    };
    // Sử dụng debounce cho hàm fetch
    const debouncedFetchProducts = debounce(fetchProducts, 500);
    debouncedFetchProducts();
    return () => {
      debouncedFetchProducts.cancel();
    };
  }, [dispatch]);

  const searchParams = {
    productName: searchName || '',
    size: productPageSize,
    page: productCurrentPage,
  };

  const handleDeletePriceList = (id: number) => {
    dispatch(deletePriceList(id));
  };
  const handleDeletePriceProduct = (id: number, productPriceId: number) => {
    dispatch(deleteProductPrice(id, productPriceId));
  };
  const handleUpdatePriceProduct = (updatedPriceProduct: ProductPrice, id: number, priceListId: number) => {
    dispatch(updateProductPriceAction(id, priceListId, updatedPriceProduct));
    setOpenUpdateForm(false);
  };
  

  const handleRowClick = (priceList: PriceList) => {
    setSelectedPriceList(priceList);
    dispatch(fetchOneProductPrice(priceList.id));
    setShowProductPriceTable(true);
  };

  const handleBackClick = () => {
    setShowProductPriceTable(false); // Quay lại bảng PriceList
    setSelectedPriceList(null); // Xoá PriceList đã chọn
  };

  const handleAddPriceList = () => {
    if (showProductPriceTable) {
      setOpenAddPriceProductModal(true);
    } else {
      // Nếu không, mở modal thêm bảng giá mới
      setOpenAddPriceModal(true);
    }
  };

  const handleAddModalCancel = () => {
    setOpenAddPriceModal(false);
    setOpenAddPriceProductModal(false);
    setOpenUpdateForm(false);
  };

  const filteredProductPrices = productPrices;

  const onAddPriceList = (formData: PriceList) => {
    // Gọi action với formData
    dispatch(addPriceList(formData));
    setOpenAddPriceModal(false); 
  };

  const onAddPriceLProduct = (formData: ProductPrice[], id: number) => {
    // Gọi action với formData
    dispatch(addProductPrice(formData, id));
    setOpenAddPriceProductModal(false); 
  };
  return (
    <Paper sx={{ p: 4, height: 1, borderRadius: 2, boxShadow: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography
          variant="h4"
          color="common.white"
          gutterBottom
          sx={{ fontWeight: 'bold', fontSize: '1.75rem' }}
        >
          {showProductPriceTable ? (
            <>
              {selectedPriceList && (
                <Typography
                  variant="h4"
                  color="common.white"
                  gutterBottom
                  sx={{ fontWeight: 'bold' }}
                >
                  {selectedPriceList.name}
                </Typography>
              )}
            </>
          ) : (
            'Bảng Giá'
          )}
        </Typography>
        <FormControl>
          {showProductPriceTable ? (
            selectedPriceList && (
              <Tooltip title={`Thêm mới ${selectedPriceList?.name || ''}`}>
                <Fab color="primary" aria-label="add" onClick={handleAddPriceList}>
                  <AddCircleOutline />
                </Fab>
              </Tooltip>
            )
          ) : (
            <Tooltip title="Thêm mới bảng giá">
              <Fab color="primary" aria-label="add" onClick={handleAddPriceList}>
                <AddCircleOutline />
              </Fab>
            </Tooltip>
          )}
        </FormControl>
      </Box>
      {loading && <Paper sx={{ display: 'block', margin: '0 auto' }} />}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      <Grid container spacing={4}>
        {showProductPriceTable ? (
          // Bảng ProductPrice
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleBackClick}
              sx={{ marginBottom: 3, fontWeight: 'bold' }}
            >
              Back
            </Button>
            {filteredProductPrices.length > 0 ? (
              <TableContainer sx={{ boxShadow: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Ảnh sản Phẩm</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Tên sản Phẩm</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProductPrices.map((price) => {
                      // Tìm sản phẩm tương ứng với productId
                      const product = products.find(
                        (product: Product) => product.productId === price.productId,
                      );

                      return (
                        <TableRow key={price.id}>
                          <TableCell>
                            <img
                              src={product?.image || 'placeholder-image-url.jpg'}
                              style={{ width: 60, height: 150, objectFit: 'contain' }}
                            />

                            {/* {product ? product.image : "không thấy"} */}
                          </TableCell>
                          <TableCell>
                            {product ? product.name : 'Tên sản phẩm không tìm thấy'}
                          </TableCell>
                          <TableCell>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'decimal',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(price.priceValue)}{' '}
                            VND
                          </TableCell>
                          <TableCell>
                          <Box display="flex" justifyContent="flex-start" alignItems="center" gap={1.5}>
                            <Button
                              color="error"
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePriceProduct(price.id!, price.productPriceId);
                              }}
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgba(211, 24, 24, 0.2)',
                                  transform: 'scale(1.1)',
                                },
                              }}
                            >
                              Delete
                            </Button>
                            <Button
                              color="primary" // Màu xanh mặc định của Material-UI
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPriceProduct(price);
                                setOpenUpdateForm(true);
                              }}
                              sx={{
                                '&:hover': {
                                  backgroundColor: 'rgb(0, 102, 255)', // Màu xanh khi hover
                                  transform: 'scale(1.1)',
                                },
                                backgroundColor: 'rgb(0, 123, 255)', // Màu xanh mặc định
                                color: '#fff', // Màu chữ trắng
                              }}
                            >
                              Sửa
                            </Button>
                          </Box>
                        </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                Không có sản phẩm trong bảng giá
              </Typography>
            )}
          </Grid>
        ) : (
          // Bảng PriceList
          <Grid item xs={12}>
            <TableContainer sx={{ boxShadow: 2 }}>
              <Table sx={{}}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {priceLists.map((priceList: PriceList) => (
                    <TableRow
                      key={priceList.id}
                      hover
                      onClick={() => handleRowClick(priceList)}
                      sx={{
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      <TableCell>{priceList.id}</TableCell>
                      <TableCell>{priceList.code}</TableCell>
                      <TableCell>{priceList.name}</TableCell>
                      <TableCell>{priceList.startDate}</TableCell>
                      <TableCell>{priceList.endDate}</TableCell>
                      <TableCell align="right">
                        <Button
                          color="error"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePriceList(priceList.id!);
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255, 0, 0, 0.2)',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
      </Grid>
      {/* Modal thêm sản phẩm */}
      <Dialog open={openAddPriceModal} onClose={handleAddModalCancel} maxWidth="sm">
        <DialogTitle>Thêm sản bảng giá mới</DialogTitle>
        <DialogContent sx={{ padding: '2rem' }}>
          {/* Thêm padding cho DialogContent */}
          <AddPriceListForm onAddPriceList={onAddPriceList} onCancel={handleAddModalCancel} />
        </DialogContent>
      </Dialog>

      <Dialog open={openAddPriceProductModal} onClose={handleAddModalCancel} maxWidth="sm">
        <DialogTitle>Thêm sản bảng giá mới</DialogTitle>
        <DialogContent sx={{ padding: '2rem' }}>
          {/* Thêm padding cho DialogContent */}
          {selectedPriceList && (
            <AddPriceProductForm
              priceListId={selectedPriceList.id} 
              onAddPriceProduct={onAddPriceLProduct}
              onCancel={handleAddModalCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openUpdateForm} onClose={handleAddModalCancel} maxWidth="sm">
        <DialogTitle>Thêm sản bảng giá mới</DialogTitle>
        <DialogContent sx={{ padding: '2rem' }}>
        {openUpdateForm && selectedPriceProduct && (
        <UpdatePriceProductForm
          id={selectedPriceProduct.id || 0}
          priceListId={selectedPriceProduct.productPriceId}
          selectedPriceProduct={selectedPriceProduct}
          onUpdatePriceProduct={handleUpdatePriceProduct}
          onCancel={() => setOpenUpdateForm(false)} // Đóng form khi nhấn Cancel
        />
      )}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default PriceListTable;
