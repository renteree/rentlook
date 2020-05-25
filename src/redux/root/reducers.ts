import { connectRouter, RouterState } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { History } from 'history';
import { rentersReducer, RentersState } from '../renters/reducers';

/*
 * The structure of the store
 */

export interface RootStateType {
  router: RouterState;
  renters: RentersState;
}

/*
 * The main combined reducer
 */

export const rootReducer = (history: History): Reducer => combineReducers({
  router: connectRouter(history),
  renters: rentersReducer,
});
