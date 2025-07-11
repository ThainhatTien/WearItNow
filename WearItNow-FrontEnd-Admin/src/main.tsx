import ReactDOM from 'react-dom/client';
import theme from 'theme/theme.ts';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import BreakpointsProvider from 'providers/BreakpointsProvider.tsx';
import router from 'routes/router';
import { Provider } from 'react-redux';

import './index.css';
import store from 'store';
import { OrderProvider } from 'pages/Oder/OrderContext';
import { SupplierProvider } from 'pages/Supplier/SupplierContext';
import { DiscountProvider } from 'pages/Discount/DiscountContext';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <OrderProvider>
      <SupplierProvider> 
        <DiscountProvider> 
          <ThemeProvider theme={theme}>
            <BreakpointsProvider>
              <CssBaseline />
              <RouterProvider router={router} />
            </BreakpointsProvider>
          </ThemeProvider>
        </DiscountProvider>
      </SupplierProvider>
    </OrderProvider>
  </Provider>
);
