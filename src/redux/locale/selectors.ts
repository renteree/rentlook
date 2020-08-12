import { createSelector, OutputSelector } from 'reselect';
import { RootStateType } from '../root/reducers';
import { LocaleState } from '~/redux/locale/reducers';
import { Language } from '~/redux/locale/types';

/*
 * Selectors are used to get data from the store
 */

// Basic selector to get the state, which is used to create more detailed selectors
const getLocaleState: (store: RootStateType) => LocaleState = ({ locale }) => locale;

type SelectorType = OutputSelector<RootStateType, Language, (res: LocaleState) => Language>;

export const getLanguage: SelectorType = createSelector(getLocaleState, ({ language }: LocaleState) => language);

export default { getLanguage };
