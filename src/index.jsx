import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Catalog from './components/Catalog/CatalogPage';

const App = () => (
  <Router className="app-inner">
    <Switch>
      <Route path="/" component={Catalog} />
    </Switch>
  </Router>
);

ReactDOM.render(<App />, document.getElementById('app-container'));
