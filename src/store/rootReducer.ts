import {combineReducers} from '@reduxjs/toolkit';
import todoReducer from './reducers/todo';
import {connectRouter} from 'connected-react-router';
import { BrowserHistory } from 'history';

export default (history: BrowserHistory) => combineReducers({
    router: connectRouter(history),
    todo: todoReducer,
});
