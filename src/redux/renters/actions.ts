import { createAction } from 'typesafe-actions';

const NEXT_PAGE = 'viper/search/GET_NEXT_PAGE';
const ADD_RENTER = 'ADD_RENTER';
const SET_ITEMS_IN_ROW = 'SET_ITEMS_IN_ROW';
const SET_ITEMS_IN_DB = 'SET_ITEMS_IN_DB';
const SET_LOADING = 'SET_LOADING';

/*
 * Each action invokes corresponding reducer with passed props in payload
 * A type of a payload is specified during an action creation
 */

export const getNextPage = createAction(NEXT_PAGE)();
export const addRenterAction = createAction(ADD_RENTER)<Models.Renter[]>();
export const setItemsInRowAction = createAction(SET_ITEMS_IN_ROW)<number>();
export const setItemsInDbAction = createAction(SET_ITEMS_IN_DB)<number>();
export const setLoadingAction = createAction(SET_LOADING)<boolean>();

export default { addRenterAction, getNextPage, setItemsInRowAction, setItemsInDbAction, setLoadingAction };
