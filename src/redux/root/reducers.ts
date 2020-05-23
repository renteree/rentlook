import { connectRouter, RouterState } from 'connected-react-router';
import { combineReducers, Reducer } from 'redux';
import { History } from 'history';
import { rentersReducer, RentersState } from '../renters/reducers';
import { localeReducer, LocaleState } from '~/redux/locale/reducers';

/*
 * The structure of the store
 */

export interface RootStateType {
  router: RouterState;
  locale: LocaleState;
  renters: RentersState;
}

/*
 * The main combined reducer
 */

export const rootReducer = (history: History): Reducer => combineReducers({
  router: connectRouter(history),
  locale: localeReducer,
  renters: rentersReducer,
});
