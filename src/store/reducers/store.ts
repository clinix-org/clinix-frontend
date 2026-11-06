import { configureStore } from '@reduxjs/toolkit';
import { medicamentoReducer } from './medicamentoReducer.ts';

export const store = configureStore({
  reducer: {
    medicamento: medicamentoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
