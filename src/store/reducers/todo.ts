import {createReducer, createAction, PayloadAction} from '@reduxjs/toolkit';

export const add_todo = createAction<Number,'ADD_TODO'>('ADD_TODO');

const INITIAL_STATE:[] = [];

export default createReducer<[],any>(INITIAL_STATE, {
  [add_todo.type]: (state: [], action: PayloadAction<Number>) => ([...state, action.payload]),
});