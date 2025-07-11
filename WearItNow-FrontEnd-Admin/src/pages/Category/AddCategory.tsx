import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, FormControl, InputLabel, MenuItem} from '@mui/material';
import { Category, CategoryWithId } from 'types/CategoryType';
import { useSelector } from 'react-redux';
import SupplierApiService from 'services/SupplierApiService';
import { Supplier } from 'types/supplierTypes';
import { useFormValidation } from 'ValidateForm/useFormValidation';


interface AddCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onAddCategory: (newCategory: Category) => void;
}

const AddCategoryModal = ({ open, onClose, onAddCategory }: AddCategoryModalProps) => {
  const { categories } = useSelector((state: any) => state.categoryData);
  const [supplites, setSupplites] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await SupplierApiService.getAllSuppliers();
        setSupplites(response.data);
      } catch (error) {
        console.error('Lỗi khi tải nhà cung cấp:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const { formData, errors, handleChange, validate, setFieldValue, handleSelectChange } = useFormValidation({
    name: '',
    description: '',
    slug: '',
    parentId: null,
    supplierId: null,
  });

  const handleAddCategory = () => {
    const validationRules = [
      { field: 'name', value: formData.name, rules: { required: true, minLength: 3 } },
      { field: 'description', value: formData.description, rules: { required: true, minLength: 5 } },
      { field: 'slug', value: formData.slug, rules: { required: true, minLength: 3 } },
      { field: 'supplierId', value: formData.supplierId, rules: { required: true } },
    ];

    const labels = { name: 'Tên', description: 'Mô tả', slug: 'Slug', supplierId: 'Nhà cung cấp' };
    const validationErrors = validate(validationRules, labels);

    // If no errors, add the category
    if (Object.keys(validationErrors).length === 0) {
      onAddCategory(formData);
      setFieldValue('name', '');
      setFieldValue('description', '');
      setFieldValue('slug', '');
      setFieldValue('parentId', null);
      setFieldValue('supplierId', null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Category</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Name Field */}
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              label="Tên"
              size='small'
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={handleChange('name')}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          {/* Description Field */}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Mô tả"
              fullWidth
              variant="outlined"
              size='small'
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          {/* Slug Field */}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Slug"
              fullWidth
              variant="outlined"
              size='small'
              value={formData.slug}
              onChange={handleChange('slug')}
              error={!!errors.slug}
              helperText={errors.slug}
            />
          </Grid>

          {/* Parent Category Field (Select Parent Category) */}
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Danh mục cha</InputLabel>
              <TextField
                select
                value={formData.parentId || ''}
                onChange={handleSelectChange('parentId')}
                size='small'
                SelectProps={{
                  displayEmpty: true,
                }}
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((category: CategoryWithId) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          {/* Supplier Field */}
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Nhà cung cấp</InputLabel>
              <TextField
                select
                value={formData.supplierId || ''}
                onChange={handleSelectChange('supplierId')}
                size='small'
                SelectProps={{
                  displayEmpty: true,
                }}
                error={!!errors.supplierId}
                helperText={errors.supplierId}
              >
                <MenuItem value="">None</MenuItem>
                {supplites.map((supplier: Supplier) => (
                  <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddCategory} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;
