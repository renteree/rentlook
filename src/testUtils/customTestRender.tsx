import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';

import '@testing-library/jest-dom';

import createTestStore from './testStore';
import history from '~/app/history';

const ProvidersWrapping: (storeInitialState?: any) => React.FC<{ children?: React.ReactNode }> = (
  storeInitialState: any = {},
) => ({ children }) => {
  return (
    <Provider store={createTestStore(storeInitialState)}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  );
};

export const customTestRender = (ui: any, options?: RenderOptions & { initialState?: any }) =>
  render(ui, { wrapper: ProvidersWrapping(options?.initialState), ...options });
