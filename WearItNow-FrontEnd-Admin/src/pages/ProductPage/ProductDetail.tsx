import React from "react";
import { Grid, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Product } from "types/ProductTypes";

interface ProductDetailViewProps {
  open: boolean;
  product: Product; // Product data passed as prop
  onCancel: () => void; // Function to cancel viewing/editing
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, }) => {
  return (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
      <Grid container spacing={3} justifyContent="center">
        {/* Product Name */}
        <Grid item xs={12} textAlign="center">
          <Typography variant="h4" fontWeight="bold">{product?.name || 'Default Name'}</Typography>
        </Grid>

        {/* Product Price */}
        <Grid item xs={12} md={6} textAlign="center">
          <Typography variant="h6" color="primary">Giá: {product?.price} VND</Typography>
        </Grid>
        <Grid item xs={12} md={6} textAlign="center">
          <Typography variant="h6" color="primary">Danh mục: {product?.category?.name} </Typography>
        </Grid>
        {/* Product Description */}
        <Grid item xs={12} textAlign="center">
          <Typography variant="body1" paragraph>{product?.description}</Typography>
        </Grid>

        {/* Product Images (Main Image and Additional Images in one row) */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" textAlign="center">Hình ảnh</Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Grid container spacing={2}>
              {/* Main Image */}
              <Grid item xs={12} md={6} textAlign="center">
                <div style={{ width: '300px', height: '300px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <img
                    src={product?.image}  
                    alt="Ảnh chính"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
              </Grid>

              {/* Additional Images (3 per row) */}
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {product?.images.map((image: any, index: number) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <div style={{ width: '100%', height: '150px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                        <img
                          src={image.imageUrl}
                          alt={`Hình ảnh phụ ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Product Inventories (Table format) */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight="bold" textAlign="center">Kho hàng</Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><strong>Size</strong></TableCell>
                  <TableCell align="center"><strong>Màu</strong></TableCell>
                  <TableCell align="center"><strong>Số lượng</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product?.inventories.map((inventory, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{inventory.size}</TableCell>
                    <TableCell align="center">
                      <span style={{ backgroundColor: inventory.color, padding: '2px 10px', borderRadius: '5px', color: '#fff' }}>
                        {inventory.color}
                      </span>
                    </TableCell>
                    <TableCell align="center">{inventory.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductDetailView;
