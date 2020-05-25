import { RootStateType } from './reducers';
import { initialState as initialRentersState } from '../renters/reducers';

/*
 * An initial state for testing purpose
 */

const initialState: RootStateType = {
  router: {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      state: '',
    },
    action: 'POP',
  },
  renters: initialRentersState,
};

export default initialState;
