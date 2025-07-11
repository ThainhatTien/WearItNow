import { Box, Paper, Typography } from '@mui/material';
import newCustomer from 'assets/images/todays-sales/new-customer.png';
import productSold from 'assets/images/todays-sales/product-sold.png';
import totalOrder from 'assets/images/todays-sales/total-order.png';
import totalSales from 'assets/images/todays-sales/total-sales.png';
import PageLoader from 'components/loading/PageLoader';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { fetchStatisticsCustomers, fetchStatisticsOrder, fetchStatisticsQuantityProduct, fetchStatisticsRevenue } from 'store/Dashboard/DashboardAction';
import SaleCard from './SaleCard';

const TodaysSales = () => {
  const { totalElements } = useSelector((state: any) => state.productData);
  const { orderData, revenueData, customersData, loading, error } = useSelector((state: any) => state.statisticsData);
  const [fromDate] = useState<Dayjs>(dayjs());
  const [toDate] = useState<Dayjs>(dayjs());
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (fromDate && toDate) {
      const fromDateString = fromDate.format('YYYY-MM-DD');
      const toDateString = toDate.format('YYYY-MM-DD');

      // Dispatch actions to fetch statistics data
      dispatch(fetchStatisticsOrder(fromDateString, toDateString));
      dispatch(fetchStatisticsRevenue(fromDateString, toDateString));
      dispatch(fetchStatisticsQuantityProduct(fromDateString, toDateString));
      dispatch(fetchStatisticsCustomers());
    }
  }, [fromDate, toDate, dispatch]);
  

  if (loading) {
    return <Typography variant="h6" color="text.primary"><PageLoader/></Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  const salesData = [
    {
      icon: totalSales,
      title: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }) .format(revenueData.totalRevenue),
      subtitle: 'Total sales',
      // increment: calculatePercentageChange(revenueData || 0, previousRevenue || 0), // Tính toán tỷ lệ thay đổi nếu cần
      color: '#ff9800',
    },
    {
      icon: totalOrder,
      title: orderData || 0,
      subtitle: 'Total orders',
      // increment: calculatePercentageChange(orderData || 0, previousOrder || 0), // Tính toán tỷ lệ thay đổi nếu cần
      color: '#4caf50',
    },
    {
      icon: productSold,
      title: totalElements || 0, // Thay thế bằng dữ liệu phù hợp
      subtitle: 'Total Product',
      // increment: 0,
      color: '#2196f3',
    },
    {
      icon: newCustomer,
      title: customersData,
      subtitle: 'Total customers',
      // increment: 0, // Tính toán tỷ lệ thay đổi nếu cần
      color: '#2196f3',
    },
  ];

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h4" color="common.white" mb={1.25} sx={{ textAlign: 'left' }}>
          Today’s Sales
        </Typography>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={{ xs: 4, sm: 6 }}>
        {salesData.map((saleItem, index) => (
          <Box key={index} gridColumn={{ xs: 'span 12', sm: 'span 6', lg: 'span 3' }}>
            <SaleCard saleItem={saleItem} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default TodaysSales;
