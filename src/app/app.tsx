import React from 'react';
import { Switch, Route } from 'react-router';
import Catalog from '../components/Catalog/CatalogPage';

const App: React.FunctionComponent = () => (
  <Switch>
    <Route path="/" component={Catalog} />
  </Switch>
);

export default App;
