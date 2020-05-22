import React from 'react';
import { useSelector } from 'react-redux';
import { getAdsList } from '~/redux/renters/selectors';
import { addRenterAction } from '~/redux/renters/actions';
import useAction from '~/hooks/useAction';

const Catalog: React.FunctionComponent = () => {
  // useSelector get adsList from the store and re-renders the component if adsList has changed
  const adsList = useSelector(getAdsList);
  // addRenter action invokes addRenter reducer with passed new renter in payload
  const addRenter = useAction(addRenterAction);

  return (
    <div>
      <h1>Catalog</h1>
      {adsList.map((ad): JSX.Element => <span>{ad.id}</span>)}
      <button type="button" onClick={(): void => { addRenter({ id: '1', uuid: '2' }); }}>Add</button>
    </div>
  );
};

export default Catalog;
