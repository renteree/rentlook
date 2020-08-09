import { put, select } from 'redux-saga/effects';
import { getTenants } from '~/api/coreApi';
import { addRenterAction, setItemsInDbAction, setLoadingAction } from './actions';
import { getAdsList, getHitsPerPage, getItemsInRow, getItemsQtyInDb, getLoading } from '~/redux/renters/selectors';

export function* onGetNextPage() {
  const items = yield select(getAdsList);
  const itemsInDb = yield select(getItemsQtyInDb);
  const loading = yield select(getLoading);

  if (items.length === itemsInDb || loading) return;

  yield put(setLoadingAction(true));

  const itemsInRow = yield select(getItemsInRow);
  const hitsPerPage = yield select(getHitsPerPage);

  const itemsInLastRow = items.length % itemsInRow;
  const limit = itemsInLastRow ? 2 * hitsPerPage - itemsInLastRow : hitsPerPage;

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
