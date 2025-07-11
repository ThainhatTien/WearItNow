import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Tooltip, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridSlots } from '@mui/x-data-grid';

import { AppDispatch, RootState } from 'store';
import { createDiscountPriceAction, getDiscountPrices, removeDiscountPriceAction, setSaleProductCurrentPage, updateDiscountPriceAction } from 'store/SaleProductAction/SaleProductAction';
import { SaleProduct } from 'types/SaleProduct';
import IconifyIcon from 'components/base/IconifyIcon';
import UpdateSaleProduct from './UpdateSaleProduct';
import AddSaleProduct from './AddSaleProduct';
import CustomPaginationWrapper from 'pages/ProductPage/CustomPaginationWrapper';
import CustomNoResultsOverlay from 'components/common/CustomNoResultsOverlay';

const DiscountPricePage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedDiscount, setSelectedDiscount] = useState<SaleProduct | null>(null);
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [openNewForm, setOpenNewForm] = useState(false);
  const { discountProducts, currentPagediscountProducts, totalPagesdiscountProducts, loading, error } = useSelector(
    (state: RootState) => state.salesData
  );

  useEffect(() => {
    dispatch(getDiscountPrices());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleAddSaleProduct = (newSaleProduct: SaleProduct) => {
    dispatch(createDiscountPriceAction(newSaleProduct));
    setOpenNewForm(false);
  };
  const handleUpdatePriceProduct = (updatedSaleProduct: SaleProduct, id: number) => {
    dispatch(updateDiscountPriceAction(id, updatedSaleProduct));
    setOpenUpdateForm(false); // Close dialog after saving
  };
  const handleDeletePriceProduct = (id: number) => {
    dispatch(removeDiscountPriceAction(id));
    setOpenUpdateForm(false); // Close dialog after saving
  };

  const columns: GridColDef[] = [
    {
      field: 'stt',
      headerName: 'STT',
      resizable: false,
      minWidth: 10,
      renderCell: (params: any) => <Typography variant="body2">{params.row.id}</Typography>,
    },
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      flex: 1,
      minWidth: 155,
      renderCell: (params: GridRenderCellParams) => <Typography variant="body2">{params.value}</Typography>,
    },
    {
      field: 'discountRate',
      headerName: '% Giảm',
      flex: 1,
      minWidth: 95,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? `${new Intl.NumberFormat('vi-VN').format(params.value)} %` : 'N/A',
    },
    {
      field: 'startDate',
      headerName: 'Ngày bắt đầu',
      flex: 1,
      minWidth: 95,
    },
    {
      field: 'endDate',
      headerName: 'Ngày hết hạn',
      flex: 1,
      minWidth: 95,

    },
    {
      field: 'price',
      headerName: 'Giá giảm',
      flex: 1,
      minWidth: 95,
    },
    {
      field: 'actions-product',
      headerName: 'Hành động',
      type: 'actions',
      flex: 1,
      minWidth: 80,
      getActions: (params: any) => [
        <Tooltip title="Sửa" key="edit">
          <GridActionsCellItem
            icon={<IconifyIcon icon="fluent:edit-32-filled" color="text.secondary" />}
            label="Sửa"
            size="small"
            onClick={() => {
              setSelectedDiscount(params.row);
              setOpenUpdateForm(true);
            }}
          />
        </Tooltip>,
        <Tooltip title="Xóa" key="delete">
          <GridActionsCellItem
            icon={<IconifyIcon icon="mingcute:delete-3-fill" color="error.main" />}
            label="Xóa"
            size="small"
            onClick={() => {
              handleDeletePriceProduct(params.row.id)
            }
            }
          />
        </Tooltip>,
      ],
    },
  ];

  const rows = discountProducts.map((discount: SaleProduct) => ({
    id: discount.id,
    productId: discount.productId,
    name: discount.product.name,
    discountRate: discount.discountRate,
    price: discount.product.price,
    startDate: discount.startDate,
    endDate: discount.endDate,
  }));

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => setOpenNewForm(true)}>
        Thêm mới
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid 
        rows={rows} 
        columns={columns} 
        autoHeight 
        disableColumnMenu 
        getRowId={(row) => row.id} 
        slots={{
          loadingOverlay: CircularProgress as GridSlots['loadingOverlay'],
          pagination: () => (
              <CustomPaginationWrapper
                  page={currentPagediscountProducts}
                  totalPages={totalPagesdiscountProducts}
                  onPageChange={(newPage: number) => {
                      setSaleProductCurrentPage(newPage + 1); 
                      
                  }}
              />
          ),
          noResultsOverlay: CustomNoResultsOverlay as GridSlots['noResultsOverlay'],
      }}/>
      </div>

      <Dialog open={openNewForm} onClose={() => setOpenNewForm(false)} maxWidth="sm">
        <DialogTitle>Thêm sản phẩm</DialogTitle>
        <DialogContent>
          <AddSaleProduct
            onAddSaleProduct={handleAddSaleProduct}
            onCancel={() => setOpenNewForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openUpdateForm} onClose={() => setOpenUpdateForm(false)} maxWidth="sm">
        <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        <DialogContent>
          {openUpdateForm && selectedDiscount && (
            <UpdateSaleProduct
              saleProductId={selectedDiscount.id}
              saleProduct={selectedDiscount}
              onClose={() => setOpenUpdateForm(false)}
              onSave={handleUpdatePriceProduct}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiscountPricePage;
