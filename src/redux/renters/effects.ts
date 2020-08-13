import { put, select } from 'redux-saga/effects';
import { getTenants } from '~/api/coreApi';
import { addRenterAction, setItemsInDbAction, setLoadingAction } from './actions';
import { getAdsList, getHitsPerPage, getItemsInRow, getItemsQtyInDb } from '~/redux/renters/selectors';

export function* onGetNextPage() {
  const items = yield select(getAdsList);
  const itemsInDb = yield select(getItemsQtyInDb);

  // Check is it the end
  if (items.length === itemsInDb && itemsInDb) {
    yield put(setLoadingAction(false));
    return;
  }

  // Adjust the items number to load
  const itemsInRow = yield select(getItemsInRow);
  const hitsPerPage = yield select(getHitsPerPage);

  const itemsInLastRow = items.length % itemsInRow;
  const limit = itemsInLastRow ? hitsPerPage - itemsInLastRow : hitsPerPage;

  // make a call
  const response = yield getTenants({
    limit,
    offset: items.length,
  });

  if (!response || response.status !== 200) {
    yield put(setLoadingAction(false));
    return;
  }
  const list: Models.Renter[] = response?.data?.tenants;

  yield put(addRenterAction(list));
  yield put(setItemsInDbAction(response?.data?.count));
  yield put(setLoadingAction(false));
}
