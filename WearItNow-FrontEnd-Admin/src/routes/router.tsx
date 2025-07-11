import { lazy, PropsWithChildren, ReactElement, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouteObject } from 'react-router-dom';

import PageLoader from 'components/loading/PageLoader';
import Splash from 'components/loading/Splash';
import paths, { rootPaths } from './paths';
import { ProtectedRoute } from './ProtectedRoute';


const App = lazy<() => ReactElement>(() => import('App'));

const MainLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/main-layout'),
);
const AuthLayout = lazy<({ children }: PropsWithChildren) => ReactElement>(
  () => import('layouts/auth-layout'),
);



const Dashboard = lazy<() => ReactElement>(() => import('pages/dashboard/Dashboard'));
const Profile = lazy<() => ReactElement>(() => import('pages/dashboard/Profile'));
const Customer = lazy<() => ReactElement>(() => import('pages/UserPage/CustomerTable'));
const Categories = lazy<() => ReactElement>(() => import('pages/Category/CategoryPage'));
const Products = lazy<() => ReactElement>(() => import('pages/ProductPage/ProductPage'));
const ProductsPrice = lazy<() => ReactElement>(() => import('pages/PriceList/PriceListTable'));
const Oder = lazy<() => ReactElement>(() => import('pages/Oder/OderPage'));
const Suppiler = lazy<() => ReactElement>(() => import('pages/Supplier/SupplierPage'))
const Discount = lazy<() => ReactElement>(() => import('pages/Discount/DiscountPage'))
const DiscountProducts = lazy<() => ReactElement>(() => import('pages/SaleProduct/SaleProductPage'));
// const Inventory =lazy<()=> ReactElement>(()=> import('pages/ProductPage/InventoryTable'))
// const EditCustomer = lazy<() => ReactElement>(() => import('pages/UserPage/UserEditPage'))
const Authenticate = lazy<() => ReactElement>(() => import('pages/Permission/PermissionTable'));
const Login = lazy<() => ReactElement>(() => import('pages/authentication/Login'));
const ForgotPassword = lazy<() => ReactElement>(() => import('pages/authentication/Forgotpass'));
const ErrorPage = lazy<() => ReactElement>(() => import('pages/error/ErrorPage'));
const UserGroup = lazy<() => ReactElement>(() => import('pages/Discount/UserGroupManager'));

const isAuthenticated = !!localStorage.getItem('token');
const routes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: paths.home,
        element: (
          <ProtectedRoute isAuthenticated={isAuthenticated} element={
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          } />
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: paths.customer,
            element: <Customer />,
          },
          {
            path: paths.profile,
            element: <Profile />
          },
          {
            path: paths.categories,
            element: <Categories />,
          },
          {
            path: paths.products,
            element: <Products />,
          },
          {
            path: paths.sales,
            element: <DiscountProducts />,
          },
          {
            path: paths.price,
            element: <ProductsPrice />,
          },
          {
            path: paths.oder,
            element: <Oder />,
          },
          {
            path: paths.supplier,
            element: <Suppiler />,
          },
          {
            path: paths.userGroup,
            element: <UserGroup />,
          },
          {
            path: paths.discount,
            element: <Discount />,
          },
          {
            path: paths.auth,
            element: <Authenticate />,
          },
          
        ],
      },
      // router đăng nhập
      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </AuthLayout>
        ),
        children: [
          {
            path: paths.login,
            element: <Login />,
          },
          {
            path: paths.signup,
            element: <ForgotPassword />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

const options: { basename: string } = {
  basename: '/',
};

const router = createBrowserRouter(routes, options);

export default router;
