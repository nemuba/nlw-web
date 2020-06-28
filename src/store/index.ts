import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {createBrowserHistory, BrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';
import rootReducer from './rootReducer';


export const history: BrowserHistory = createBrowserHistory();

const store = configureStore({
  reducer: rootReducer(history),
  middleware: [...getDefaultMiddleware(), routerMiddleware(history)],
  devTools: process.env.NODE_ENV !== "production",
});

export default store;