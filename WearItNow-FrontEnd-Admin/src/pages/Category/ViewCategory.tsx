import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Box, Grid, Divider } from '@mui/material';
import { CategoryWithId } from 'types/CategoryType';

interface ViewCategoryModalProps {
  open: boolean;
  category: CategoryWithId | null;
  onClose: () => void;
}

const ViewCategoryModal = ({ open, category, onClose }: ViewCategoryModalProps) => {
  if (!category) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          borderBottom: '1px solid #ddd',
        }}
      >
        Chi tiết danh mục
      </DialogTitle>
      <DialogContent>
        <Box sx={{ padding: 2 }}>
          <Grid container spacing={2}>
            {/* Name */}
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="h6" sx={{ color: '#c9bcbc', fontWeight: 500 }}>
                  {category.name}
                </Typography>
              </Box>
            </Grid>
            <Divider flexItem sx={{ width: '100%', my: 1 }} />
            {/* Slug */}
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" color="textSecondary">
                  Slug
                </Typography>
                <Typography variant="h6" sx={{ color: '#c9bcbc', fontWeight: 500 }}>
                  {category.slug}
                </Typography>
              </Box>
            </Grid>
            <Divider flexItem sx={{ width: '100%', my: 1 }} />
            {/* Description */}
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  {category.description || 'No description provided.'}
                </Typography>
              </Box>
            </Grid>
            <Divider flexItem sx={{ width: '100%', my: 1 }} />
            {/* Parent Category */}
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" color="textSecondary">
                  Parent Category
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  {category.parentId || 'None'}
                </Typography>
              </Box>
            </Grid>
            {/* Supplier ID */}
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" color="textSecondary">
                  Supplier ID
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  {category.supplierId}
                </Typography>
              </Box>
            </Grid>
            <Divider flexItem sx={{ width: '100%', my: 1 }} />
            {/* Status */}
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: category.status ? 'green' : 'red',
                    fontWeight: 500,
                  }}
                >
                  {category.status ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            </Grid>
            {/* Subcategories */}
            <Grid item xs={6}>
              <Box display="flex" flexDirection="column">
                <Typography variant="subtitle2" color="textSecondary">
                  Subcategories
                </Typography>
                <Typography variant="body1" sx={{ color: '#555' }}>
                  {category.subCategories?.length
                    ? `${category.subCategories.length} subcategories`
                    : 'No subcategories'}

                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{
            margin: '0 auto',
            fontWeight: 'bold',
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewCategoryModal;
