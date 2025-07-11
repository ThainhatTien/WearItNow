export interface NavItem {
  id: number;
  path: string;
  title: string;
  icon: string;
  active: boolean;
}

const navItems: NavItem[] = [
  {
    id: 1,
    path: '/',
    title: 'Dashboard',
    icon: 'mingcute:home-1-fill',
    active: true,
  },
  {
    id: 2,
    path: '/users',
    title: 'Customer',
    icon: 'clarity:user-line',
    active: true,
  },
  {
    id: 3,
    path: '/category',
    title: 'Categry',
    icon: 'material-symbols-light:leaderboard-outline',
    active: false,
  },
  {
    id: 4,
    path: '/oder',
    title: 'Order',
    icon: 'ant-design:shopping-cart-outlined',
    active: false,
  },
  {
    id: 5,
    path: '/products',
    title: 'Product',
    icon: 'lets-icons:bag-alt-light',
    active: false,
  },
   {
    id: 12,
    path: '/price-list',
    title: 'List Price',
    icon: 'ph:currency-circle-dollar',
    active: false,
  },
  {
    id: 14,
    path: '/saleProducts',
    title: 'Product Sale',
    icon: 'ph:tag',
    active: false,
  },
  {
    id: 13,
    path: '/discount',
    title: 'Discount',
    icon: 'tabler:discount-2', 
    active: false,
  },
  {
    id: 6,
    path: '/supplier',
    title: 'Supplier',
    icon: 'lucide:line-chart',
    active: false,
  },
  {
    id: 7,
    path: '/userGroup',
    title: 'Message',
    icon: 'bi:chat',
    active: false,
  },
  {
    id: 8,
    path: '/role-permission',
    title: 'Authentication',
    icon: 'mingcute:settings-3-line',
    active: false,
  },
  {
    id: 9,
    path: '#!',
    title: 'Favourite',
    icon: 'clarity:favorite-line',
    active: false,
  },
  {
    id: 10,
    path: '#!',
    title: 'History',
    icon: 'ic:round-history',
    active: false,
  },
  {
    id: 11,
    path: 'authentication/login',
    title: 'Login',
    icon: 'tabler:login',
    active: true,
  },
  // {
  //   id: 12,
  //   path: 'authentication/sign-up',
  //   title: 'Sign Up',
  //   icon: 'tdesign:user-add',
  //   active: true,
  // },
];

export default navItems;
