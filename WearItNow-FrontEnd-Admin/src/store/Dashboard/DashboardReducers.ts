
interface StatisticsState {
  loading: boolean;
  orderData: number;
  revenueData: number;
  customersData: number;
  quantitProductData: number;
  error: string | null;
}

const initialState: StatisticsState = {
  loading: false,
  orderData: 0,
  revenueData: 0,
  customersData: 0,
  quantitProductData: 0,
  error: null,
};

const STATISTICS_FIELDS = {
  ORDER: 'orderData',
  REVENUE: 'revenueData',
  CUSTOMERS: 'customersData',
  QUANTITY_PRODUCT: 'quantitProductData',
};

export const statisticsReducer = (state = initialState, action: any) => {
  const field = action.type.split('_')[2] as keyof typeof STATISTICS_FIELDS; // Lấy tên trường (ví dụ: ORDER, REVENUE, v.v.)

 // Thực thi reducer logic
  switch (action.type) {
    case `FETCH_STATISTICS_${field}_REQUEST`: // Sử dụng đúng định dạng
      return {
        ...state,
        loading: true,
        error: null,
      };

    case `FETCH_STATISTICS_${field}_SUCCESS`:
      return {
        ...state,
        loading: false,
        [STATISTICS_FIELDS[field]]: action.payload, // Cập nhật trường tương ứng
      };

    case `FETCH_STATISTICS_${field}_FAILURE`:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state; // Trả về state hiện tại nếu không khớp action
  }
};
