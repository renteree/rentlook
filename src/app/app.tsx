import React from 'react';
import { Switch, Route } from 'react-router';

import Sidebar from '~/components/Sidebar/Sidebar';
import Catalog from '../components/Catalog/Catalog';
import NotFound from '~/components/NotFound/NotFound';
import CreateRenter from '~/components/NewRenter/CreateRenter';
import Renter from '~/components/Renter/Renter';

const App: React.FunctionComponent = () => (
  <div className="root">
    <Sidebar />
    <main id="content">
      <div className="toolbar" />
      <Switch>
        <Route exact path="/" component={Catalog} />
        <Route exact path="/create" component={CreateRenter} />
        <Route exact path="/ad/:id" component={Renter} />
        <Route path="/" component={NotFound} />
      </Switch>
    </main>
  </div>
);

export default App;
