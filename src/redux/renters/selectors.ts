import { createSelector, OutputSelector } from 'reselect';
import { RootStateType } from '../root/reducers';
import { RentersState } from './reducers';

/*
 * Selectors are used to get data from the store
 */

// Basic selector to get the state, which is used to create more detailed selectors
export const getStoreState: (store: RootStateType) => RentersState = ({ renters }) => renters;

type SelectorType = OutputSelector<RootStateType, Models.Renter[],
(res: RentersState) => Models.Renter[]>;

export const getAdsList: SelectorType = createSelector(
  getStoreState,
  ({ adsList }: RentersState) => adsList,
);
