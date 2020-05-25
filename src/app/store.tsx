import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from '~/redux/root/reducers';
import history from './history';

/*
 * Adding DevTools to Redux
 */

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});

/*
 * Composing all reducers to the single store
 */

const store = createStore(
  // the main reducer which includes all reducers and passes history to them
  rootReducer(history),
  // the reducer which adds router and devtools usage
  composeEnhancers(applyMiddleware(routerMiddleware(history))),
);

export default store;
