
export const rootPaths = {
  homeRoot: '/',
  customer: 'users',
  userGroup: 'userGroup',
  profile:'profile',
  categories:'category',
  products:'products',
  price:'price-list',
  oder:'oder',
  supplier:'supplier',
  discount:'discount',
  sales:'saleProducts',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  home: `/${rootPaths.homeRoot}`,
  customer: `/${rootPaths.customer}`,
  profile: `/${rootPaths.customer}/${rootPaths.profile}`,
  categories:`/${rootPaths.categories}`,
  products:`${rootPaths.products}`,
  price: `${rootPaths.price}`,
  userGroup:`${rootPaths.userGroup}`,
  oder:`${rootPaths.oder}`,
  supplier:`${rootPaths.supplier}`,
  discount:`${rootPaths.discount}`,
  inventories:`${rootPaths.products}/inventories`,
  auth: `/${rootPaths.homeRoot}/role-permission`,
  login: `/${rootPaths.authRoot}/login`,
  signup: `/${rootPaths.authRoot}/forgot-password`,
  404: `/${rootPaths.errorRoot}/404`,
};
