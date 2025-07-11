import React, { useEffect } from 'react';
import { Button, Grid, Stack, TextField } from '@mui/material';
import { SaleProduct } from 'types/SaleProduct';
import { useFormValidation } from 'ValidateForm/useFormValidation';

interface EditProductDialogProps {
  saleProductId: number;
  saleProduct: SaleProduct;
  onClose: () => void;
  onSave: (updatedSaleProduct: SaleProduct, saleProductId: number) => void;
}

const UpdateSaleProduct: React.FC<EditProductDialogProps> = ({ saleProduct, onSave, onClose }) => {
  const { formData, errors, handleChange, validate, } = useFormValidation({
    productId: saleProduct.productId || 0,
    saleProductId: saleProduct.id || 0,
    discountRate: saleProduct.discountRate || 0,
    startDate: saleProduct.startDate || '',
    endDate: saleProduct.endDate || '',
  });

  useEffect(() => {

  }, [saleProduct]);

  const handleFinish = () => {
    const labels = {
      discountRate: 'Giảm giá (%)',
      startDate: 'Ngày bắt đầu',
      endDate: 'Ngày kết thúc',
    };

    const validationRules = [
      { field: 'discountRate', value: formData.discountRate, rules: { required: true, min: 0, max: 100 } },
      { field: 'startDate', value: formData.startDate, rules: { required: true } },
      { field: 'endDate', value: formData.endDate, rules: { required: true } },
    ];

    const newErrors = validate(validationRules, labels);

    if (Object.keys(newErrors).length === 0) {
      onSave(formData, formData.saleProductId);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item sx={{ visibility: "hidden", height: 0 }}>
          <TextField
            type="hidden"
            name="discountRate"
            value={formData.productId || ''}
            onChange={handleChange('productId')}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item sx={{ visibility: "hidden", height: 0 }}>
        <TextField
          type="hidden"
          name="discountRate"
          value={formData.saleProductId || ''}
          onChange={handleChange('discountRate')}
          fullWidth
          margin="normal"
        />
        </Grid>
        <TextField
          label="Giảm giá (%)"
          type="number"
          name="discountRate"
          value={formData.discountRate || ''}
          onChange={handleChange('discountRate')}
          fullWidth
          margin="normal"
          error={!!errors.discountRate}
          helperText={errors.discountRate}
        />

        <TextField
          label="Ngày bắt đầu"
          type="date"
          name="startDate"
          value={formData.startDate || ''}
          onChange={handleChange('startDate')}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.startDate}
          helperText={errors.startDate}
        />

        <TextField
          label="Ngày kết thúc"
          type="date"
          name="endDate"
          value={formData.endDate || ''}
          onChange={handleChange('endDate')}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          error={!!errors.endDate}
          helperText={errors.endDate}
        />
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              variant="contained"
              sx={{ backgroundColor: "secondary.main" }}
              onClick={handleFinish}
            >
              Update
            </Button>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateSaleProduct;
