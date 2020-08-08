import axios, { AxiosResponse } from 'axios';

import config from '../config';
import reportError from '../common/reportError';

import Renter = Models.Renter;
import Catalog = Models.Catalog;

const instance = axios.create({
  baseURL: config.coreApiUrl,
  timeout: 15000,
  headers: {
    'content-type': 'application/json',
  },
});

export const getTenants = async (params: Catalog): Promise<AxiosResponse | void> => {
  try {
    return instance.get('/tenants', {
      params,
    });
  } catch (e) {
    return reportError(e);
  }
};

export const getTenant = async (id: string): Promise<AxiosResponse | void> => {
  try {
    return instance.get(`/tenant/${id}`);
  } catch (e) {
    return reportError(e);
  }
};

export const postTenants = async (body: Renter): Promise<AxiosResponse | void> => {
  try {
    return instance.post('/tenants', body);
  } catch (e) {
    return reportError(e);
  }
};
