import { Box, Paper, Typography } from '@mui/material';
import EarningsChart from './EarningsChart';
import { ReactElement, useEffect, useRef, useState } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatisticsRevenue } from 'store/Dashboard/DashboardAction';
import { AppDispatch } from 'store';
import dayjs, { Dayjs } from 'dayjs';

const Earnings = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const { revenueData, } = useSelector((state: any) => state.statisticsData);
  const [fromDate] = useState<Dayjs>(dayjs('2000-01-01'));
  const [toDate] = useState<Dayjs>(dayjs());
  const dispatch: AppDispatch = useDispatch();
  
  
  const currencyFormat = (num: number): string => 
    num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  useEffect(() => {
    if (fromDate && toDate) {
      const fromDateString = fromDate.format('YYYY-MM-DD');
      const toDateString = toDate.format('YYYY-MM-DD');
      dispatch(fetchStatisticsRevenue(fromDateString, toDateString));
    }
  }, [dispatch, fromDate, toDate]);

  // Tính tỷ lệ phần trăm lợi nhuận trên tổng doanh thu
  const calculateProfitPercentage = (totalProfit: number, totalRevenue: number) => {
    if (totalRevenue === 0) return '0'; // Trả về chuỗi '0' nếu không có doanh thu
    return ((totalProfit / totalRevenue) * 100).toFixed(2); 
  };

  const totalRevenue = revenueData?.totalRevenue || 0;
  const totalProfit = revenueData?.totalProfit || 0;
  const profitPercentage = calculateProfitPercentage(totalProfit, totalRevenue);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={2.5}>
        Doanh thu
      </Typography>
      <Typography variant="body1" color="text.primary" mb={4.5}>
        Số tiền lãi
      </Typography>
      <Typography
        variant="h1"
        color="primary.main"
        mb={4.5}
        fontSize={{ xs: 'h2.fontSize', sm: 'h1.fontSize' }}
      >
        {currencyFormat(totalProfit)}
      </Typography>
      <Typography variant="body1" color="text.primary" mb={15}>
        Lợi nhuận là {profitPercentage}% so với tháng trước
      </Typography>
      <Box
        flex={1}
        sx={{
          position: 'relative',
        }}
      >
        <EarningsChart
          chartRef={chartRef}
          profitPercentage={parseFloat(profitPercentage)} // Truyền profitPercentage vào EarningsChart
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flex: '1 1 0%',
            maxHeight: 152,
          }}
        />
        <Typography
          variant="h1"
          color="common.white"
          textAlign="center"
          mx="auto"
          position="absolute"
          left={0}
          right={0}
          bottom={0}
        >
          {profitPercentage}%
        </Typography>
      </Box>
    </Paper>
  );
};

export default Earnings;
