import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, useSelector } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { IntlProvider } from 'react-intl';

import App from './app/app';
import history from './app/history';
import store from './app/store';
import { getLanguage } from '~/redux/locale/selectors';
import translations from '~/redux/locale/translations';

const LocalizedApp: React.FunctionComponent = () => {
  const usersLocale = useSelector(getLanguage);

  return (
    <IntlProvider locale={usersLocale} messages={translations[usersLocale]}>
      <App />
    </IntlProvider>
  );
};

const Root: React.FunctionComponent = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <LocalizedApp />
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(<Root />, document.getElementById('app-container'));
