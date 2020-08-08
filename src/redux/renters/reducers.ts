import { ActionType, createReducer } from 'typesafe-actions';
import * as Actions from './actions';
import { ActionTypes } from '~/redux/renters/types';

/*
 * The type and the list of props in store.renters
 */

export interface RentersState {
  adsList: Models.Renter[];
}

export const initialState: RentersState = {
  adsList: [],
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
    adsList,
  };
};

/*
 * Combined reducer for RentersState with pairs of corresponding action and reducers
 */

export const rentersReducer = createReducer<RentersState, ActionTypes>(initialState)
  .handleAction(Actions.addRenterAction, addRenter);
