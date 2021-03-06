import { takeLatest } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import { onGetNextPage } from './effects';
import { getNextPageAction } from './actions';

export function* getNextPageSaga() {
  yield takeLatest(getType(getNextPageAction), onGetNextPage);
}
