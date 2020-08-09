// Core
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

// Components
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListingItem from '~/components/Catalog/ListingItem';

// Redux
import useAction from '~/hooks/useAction';
import { getAdsList, getHitsPerPage, getLoading } from '~/redux/renters/selectors';
import { addRenterAction, getNextPage, setLoadingAction } from '~/redux/renters/actions';

// Api
import { getTenants } from '~/api/coreApi';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';

const Catalog: React.FunctionComponent = () => {
  // const [loading, setLoading] = useState<boolean>(false);
  const getNextPageAction = useAction(getNextPage);
  const setLoading = useAction(setLoadingAction);
  // useSelector get adsList from the store and re-renders the component if adsList has changed
  const adsList: Models.Renter[] = useSelector(getAdsList);
  const itemsPerPage: number = useSelector(getHitsPerPage);
  const loading: boolean = useSelector(getLoading);
  // addRenter action invokes addRenter reducer with passed new renter in payload
  const addRenter = useAction(addRenterAction);

  const loadMore = useCallback(() => getNextPageAction(), [getNextPageAction]);
  useInfiniteScroll({ onLoadMore: loadMore, selectorId: 'catalog-page' });


  const downloadCatalog = async (): Promise<void> => {
    setLoading(true);

    const response = await getTenants({ offset: 0, limit: itemsPerPage });

    if (!response) return;
    if (response.status !== 200) return;

    const list: Models.Renter[] = response?.data?.tenants;
    addRenter(list);

    setLoading(false);
  };
  //
  useEffect(() => {
    downloadCatalog();
  }, []);

  const firstItemRef = useRef<HTMLElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  const plug = (index: number): JSX.Element => <div className="item-container" key={index} />;

  const [plugsNumber, setPlugsNumber] = useState(0);

  useEffect(() => {
    const catalogWidth: number = catalogRef.current?.clientWidth || 0;
    const itemWidth = firstItemRef.current?.clientWidth || 1;

    const numberInRow = Math.floor(catalogWidth / itemWidth);
    const hasItemsInLastRow = numberInRow && Math.floor(adsList.length % numberInRow);
    setPlugsNumber(hasItemsInLastRow === 0 ? 0 : numberInRow - hasItemsInLastRow);
  });

  return (
    <Box display="flex" flexDirection="column" height="calc(100% - 100px)">
     {!!adsList.length
       && <div id="catalog-page" ref={catalogRef}>
          {adsList.map((ad, index) => (
            <ListingItem item={ad} key={ad.id} ref={index === 0 ? firstItemRef : undefined} />
          ))}
          {!!plugsNumber && [...Array(plugsNumber)].map((number, i) => plug(i))}
        </div>
     }
      {loading
      && (
        <Box display="flex" justifyContent="center" alignItems="center" flex={adsList.length ? 0 : 1}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Catalog;
