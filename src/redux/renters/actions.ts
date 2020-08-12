import { createAction } from 'typesafe-actions';

const NEXT_PAGE = 'viper/search/GET_NEXT_PAGE';
const ADD_RENTER = 'ADD_RENTER';
const SET_ITEMS_IN_ROW = 'SET_ITEMS_IN_ROW';
const SET_ITEMS_IN_DB = 'SET_ITEMS_IN_DB';
const SET_LOADING = 'SET_LOADING';
const SET_HITS_PER_PAGE = 'SET_HITS_PER_PAGE';

/*
 * Each action invokes corresponding reducer with passed props in payload
 * A type of a payload is specified during an action creation
 */

export const getNextPageAction = createAction(NEXT_PAGE)();
export const addRenterAction = createAction(ADD_RENTER)<Models.Renter[]>();
export const setItemsInRowAction = createAction(SET_ITEMS_IN_ROW)<number>();
export const setItemsInDbAction = createAction(SET_ITEMS_IN_DB)<number>();
export const setLoadingAction = createAction(SET_LOADING)<boolean>();
export const setHitsPerPageAction = createAction(SET_HITS_PER_PAGE)<number>();

export default {
  addRenterAction,
  getNextPageAction,
  setItemsInRowAction,
  setItemsInDbAction,
  setLoadingAction,
  setHitsPerPageAction,
};
