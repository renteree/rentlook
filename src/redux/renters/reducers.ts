import { ActionType, createReducer } from 'typesafe-actions';
import * as Actions from './actions';
import { ActionTypes } from '~/redux/renters/types';

/*
 * The type and the list of props in store.renters
 */

export interface RentersState {
  adsList: Models.Renter[];
  itemsInRow: number;
  itemsQtyInDb: number;
  hitsPerPage: number;
  loading: boolean;
}

export const initialState: RentersState = {
  adsList: [],
  itemsInRow: 0,
  itemsQtyInDb: 0,
  hitsPerPage: 8,
  loading: false,
};

/*
 * Reducers which accept RentersState and props in payload according to action definition
 */

// Ads a renter advertisement to list in the store
export const addRenter = (
  state: RentersState,
  { payload: renters }: ActionType<typeof Actions.addRenterAction>,
): RentersState => {
  const adsList = [...state.adsList, ...renters];

  return {
    ...state,
    adsList,
  };
};

export const setItemsInRow = (
  state: RentersState,
  { payload: itemsInRow }: ActionType<typeof Actions.setItemsInRowAction>,
): RentersState => ({
  ...state,
  itemsInRow,
});

export const setItemsQtyInDb = (
  state: RentersState,
  { payload: itemsQtyInDb }: ActionType<typeof Actions.setItemsInDbAction>,
): RentersState => ({
  ...state,
  itemsQtyInDb,
});

export const setLoading = (
  state: RentersState,
  { payload: loading }: ActionType<typeof Actions.setLoadingAction>,
): RentersState => ({
  ...state,
  loading,
});

/*
 * Combined reducer for RentersState with pairs of corresponding action and reducers
 */

export const rentersReducer = createReducer<RentersState, ActionTypes>(initialState)
  .handleAction(Actions.addRenterAction, addRenter)
  .handleAction(Actions.setItemsInRowAction, setItemsInRow)
  .handleAction(Actions.setItemsInDbAction, setItemsQtyInDb)
  .handleAction(Actions.setLoadingAction, setLoading);
