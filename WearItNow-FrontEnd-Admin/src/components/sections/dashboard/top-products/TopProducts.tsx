import { ReactElement, useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';
import { ProductItem } from 'data/product-data';
import ProductItemRow from './ProductItemRow';
import SimpleBar from 'simplebar-react';
import { getStatisticsTopProduct } from 'services/ApiDashboard';

const TopProducts = (): ReactElement => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fromDate = '2024-01-01'; // Thay thế bằng giá trị thực tế
        const toDate = '2024-12-31'; // Thay thế bằng giá trị thực tế
        const response = await getStatisticsTopProduct(fromDate, toDate);
        setProducts(response.data.result); // Giả định API trả về mảng sản phẩm
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
    <Typography variant="h4" color="common.white" mb={6}>
      Top Products
    </Typography>
    {loading ? (
      <Typography variant="h6" color="common.white" textAlign="center">
        Loading...
      </Typography>
    ) : (
      <TableContainer component={SimpleBar}>
        <Table sx={{ minWidth: 440 }}>
          <TableHead>
            <TableRow>
              {/* <TableCell align="left">#</TableCell> */}
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Total Revenue</TableCell>
              <TableCell align="center">Quantity Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product,) => (
              <ProductItemRow key={product.name} productItem={{ ...product}} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Paper>
  );
};

export default TopProducts;
