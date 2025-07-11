import { AppDispatch } from "store";
import { 
  getStatisticsCustomers, 
  getStatisticsOrder, 
  getStatisticsQuantityProduct, 
  getStatisticsRevenue, 
  getStatisticsTopProduct 
} from "services/ApiDashboard";

// Constants
const STATISTICS_ACTIONS = [
  'ORDER', 'REVENUE', 'CUSTOMERS', 'QUANTITY_PRODUCT',
];

// Tạo Action Types và Action Creators một cách động
const createActionTypes = (action: string) => ({
  REQUEST: `FETCH_STATISTICS_${action}_REQUEST`,
  SUCCESS: `FETCH_STATISTICS_${action}_SUCCESS`,
  FAILURE: `FETCH_STATISTICS_${action}_FAILURE`
});

const createActionCreator = (action: string) => ({
  request: () => ({ type: createActionTypes(action).REQUEST }),
  success: (data: any) => ({ type: createActionTypes(action).SUCCESS, payload: data }),
  failure: (error: string) => ({ type: createActionTypes(action).FAILURE, payload: error })
});

export const actions = STATISTICS_ACTIONS.reduce((acc, action) => {
  acc[action] = createActionCreator(action);
  return acc;
}, {} as Record<string, any>);

// Async Actions (Thunks)
const createAsyncAction = (action: string, apiCall: Function) => {
  return (fromDate: string, toDate: string) => async (dispatch: AppDispatch) => {
    dispatch(actions[action].request());
    try {
      const response = await apiCall(fromDate, toDate);
      dispatch(actions[action].success(response.data.result.value));
    } catch (error: any) {
      dispatch(actions[action].failure(error.response?.data?.message || `Error fetching ${action.toLowerCase()} statistics`));
    }
  };
};

const createAsyncActions = (action: string, apiCall: Function) => {
  return () => async (dispatch: AppDispatch) => {
    dispatch(actions[action].request());
    try {
      const response = await apiCall();
      dispatch(actions[action].success(response.data.result.value));
    } catch (error: any) {
      dispatch(actions[action].failure(error.response?.data?.message || `Error fetching ${action.toLowerCase()} statistics`));
    }
  };
};

// Xuất async actions
export const fetchStatisticsOrder = createAsyncAction('ORDER', getStatisticsOrder);
export const fetchStatisticsRevenue = createAsyncAction('REVENUE', getStatisticsRevenue);
export const fetchStatisticsCustomers = createAsyncActions('CUSTOMERS', getStatisticsCustomers);
export const fetchStatisticsQuantityProduct = createAsyncAction('QUANTITY_PRODUCT', getStatisticsQuantityProduct);
export const fetchStatisticsTopProduct = createAsyncAction('TOP_PRODUCT', getStatisticsTopProduct);
