// Core
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Components
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import RootRef from '@material-ui/core/RootRef';
import ListingItem from '~/components/Catalog/ListingItem';

// Redux
import useAction from '~/hooks/useAction';
import { getAdsList, getHitsPerPage, getLoading } from '~/redux/renters/selectors';
import {
  getNextPageAction,
  setHitsPerPageAction,
  setItemsInRowAction,
  setLoadingAction,
} from '~/redux/renters/actions';

// Api
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';

const Catalog: React.FunctionComponent = () => {
  const getNextPage = useAction(getNextPageAction);
  const setHitsPerPage = useAction(setHitsPerPageAction);
  const setItemsInRow = useAction(setItemsInRowAction);
  const setLoading = useAction(setLoadingAction);

  // useSelector get adsList from the store and re-renders the component if adsList has changed
  const adsList: Models.Renter[] = useSelector(getAdsList);
  const itemsPerPage: number = useSelector(getHitsPerPage);
  const loading: boolean = useSelector(getLoading);

  const loadMore = useCallback(() => {
    if (loading) return;
    setLoading(true);
    getNextPage();
  }, [getNextPage]);

  // First download
  useEffect(loadMore, []);
  // Subsequent downloads
  useInfiniteScroll({ onLoadMore: loadMore });

  // Elements are used to count the number of items in a row
  const firstItemRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const plug = (index: number): JSX.Element => <Box className="item-container" key={index} />;

  const [plugsNumber, setPlugsNumber] = useState(0);

  const catalogWidth: number = catalogRef.current?.clientWidth || 0;
  const itemWidth = firstItemRef.current?.clientWidth || 1;
  const numberInRow = Math.floor(catalogWidth / itemWidth);

  // Update alignment of items avoiding stretching the last item
  useEffect(() => {
    const hasItemsInLastRow = numberInRow && Math.floor(adsList.length % numberInRow);
    const plugs = hasItemsInLastRow === 0 ? 0 : numberInRow - hasItemsInLastRow;
    setPlugsNumber(plugs);
  }, [numberInRow, adsList]);

  // Update the state to load right number of items
  useEffect(() => {
    setItemsInRow(numberInRow);
    if (plugsNumber) {
      setHitsPerPage(itemsPerPage + plugsNumber);
    }
  }, [plugsNumber, numberInRow, itemsPerPage]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" height="100%">
      {!!adsList.length && (
        <RootRef rootRef={catalogRef}>
          <Box id="catalog-page">
            {adsList.map((ad, index) => (
              <ListingItem item={ad} key={ad.id} ref={index === 0 ? firstItemRef : undefined} />
            ))}
            {!!plugsNumber && [...Array(plugsNumber)].map((number, i) => plug(i))}
          </Box>
        </RootRef>
      )}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" flex={adsList.length ? 0 : 1} p={4}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Catalog;
