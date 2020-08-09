import { all } from 'redux-saga/effects';
import { getNextPageSaga } from '../renters/sagas';

export function* rootSaga() {
  yield all([
    getNextPageSaga(),
  ]);
}
