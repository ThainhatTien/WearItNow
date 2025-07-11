// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Đảm bảo đường dẫn đến file reducer đúng


const store = configureStore({
  reducer: rootReducer,
  // Thêm thunk middleware

});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
