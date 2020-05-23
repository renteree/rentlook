// Core
import React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// Locale
import messages from './messages';

// Redux
import useAction from '~/hooks/useAction';
import { getAdsList } from '~/redux/renters/selectors';
import { getLanguage } from '~/redux/locale/selectors';
import { addRenterAction } from '~/redux/renters/actions';
import { changeLanguageAction } from '~/redux/locale/actions';
import { arrayWithAllLanguages } from '~/redux/locale/types';

const Catalog: React.FunctionComponent = () => {
  // useSelector get adsList from the store and re-renders the component if adsList has changed
  const adsList = useSelector(getAdsList);
  // usersLocale get language from the store and re-renders the component if language has changed
  const usersLocale = useSelector(getLanguage);
  // addRenter action invokes addRenter reducer with passed new renter in payload
  const addRenter = useAction(addRenterAction);
  // changeLanguage action invokes changeLanguage reducer with passed new locale language in payload
  const changeLanguage = useAction(changeLanguageAction);

  return (
    <div className="catalog-page">
      <h1>
        <FormattedMessage {...messages.title} />
      </h1>
      <span>Current language: {usersLocale}</span>
      <select onChange={(event): void => { changeLanguage(event.target.value); }}>
        {arrayWithAllLanguages.map(language => (
          <option value={language} key={language}>{language}</option>
        ))}
      </select>
      <span>Total number of renters ads: {adsList.length}</span>
      <button type="button" onClick={(): void => { addRenter({ id: '1', uuid: '2' }); }}>Add</button>
    </div>
  );
};

export default Catalog;
