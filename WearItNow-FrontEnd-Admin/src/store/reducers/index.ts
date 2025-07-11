import { combineReducers } from 'redux';
import userReducer from '../User/UserReducer';
import roleReducer from '../Role/RoleReducer';
import permissionReducer from '../AuthenticationAction/PermissionReducer';
import categoryReducer from 'store/Category/CategoriesReducers';
import productReducer from 'store/Product/ProductReducers';
import { inventoryReducer } from 'store/ProductInventory/InventoryReducers';
import orderReducer from 'store/Oder/orderReducer';
import { statisticsReducer } from 'store/Dashboard/DashboardReducers';
import priceListReducer from 'store/PriceList/PriceListReducers';
import productPriceReducer from 'store/PriceList/ProductPriceReducers';
import saleProductReducer from 'store/SaleProductAction/SaleProductReducers';



const rootReducer = combineReducers({
  userData: userReducer,
  role: roleReducer,
  permission: permissionReducer,
  categoryData: categoryReducer,
  productData: productReducer,
  InventoryData: inventoryReducer,
  orderData: orderReducer,
  statisticsData: statisticsReducer,
  priceList: priceListReducer,
  producPriceData:productPriceReducer,
  salesData: saleProductReducer,
});

export default rootReducer;
