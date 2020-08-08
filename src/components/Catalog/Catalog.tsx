// Core
import React, { useEffect, useRef, useState } from 'react';

// Redux
import { useSelector } from 'react-redux';
import useAction from '~/hooks/useAction';
import { getAdsList } from '~/redux/renters/selectors';
import { addRenterAction } from '~/redux/renters/actions';
import { getTenants } from '~/api/coreApi';
import ListingItem from '~/components/Catalog/ListingItem';

const Catalog: React.FunctionComponent = () => {
  // useSelector get adsList from the store and re-renders the component if adsList has changed
  const adsList: Models.Renter[] = useSelector(getAdsList);
  // addRenter action invokes addRenter reducer with passed new renter in payload
  const addRenter = useAction(addRenterAction);

  const downloadCatalog = async (): Promise<void> => {
    const response = await getTenants({});

    if (!response) return;
    if (response.status !== 200) return;

    const list: Models.Renter[] = response?.data?.tenants;
    addRenter(list);
  };

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
    setPlugsNumber(numberInRow === 1 ? 0 : numberInRow - hasItemsInLastRow);
  });

  return (
    <div className="catalog-page" ref={catalogRef}>
      {adsList.map((ad, index) => (
        <ListingItem item={ad} key={ad.id} ref={index === 0 ? firstItemRef : undefined} />
      ))}
      {plugsNumber && [...new Array(plugsNumber)].map((number, i) => plug(i))}
    </div>
  );
};

export default Catalog;
