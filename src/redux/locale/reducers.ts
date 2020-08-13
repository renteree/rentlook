import { ActionType, createReducer } from 'typesafe-actions';
import * as Actions from './actions';
import { Language, ActionTypes } from '~/redux/locale/types';

/*
 * The type and the list of props in store.renters
 */

export interface LocaleState {
  language: Language;
}

export const initialState: LocaleState = {
  language: 'en',
};

/*
 * Reducers which accept LocaleState and props in payload according to action definition
 */

// Ads a renter advertisement to list in the store
export const changeLanguage = (
  state: LocaleState,
  { payload: language }: ActionType<typeof Actions.changeLanguageAction>,
): LocaleState => ({
  language,
});

/*
 * Combined reducer for RentersState with pairs of corresponding action and reducers
 */

export const localeReducer = createReducer<LocaleState, ActionTypes>(initialState).handleAction(
  Actions.changeLanguageAction,
  changeLanguage,
);
