import axios, { AxiosResponse } from 'axios';

import config from '../config';
import reportError from '../common/reportError';

import Catalog = Models.Catalog;

const instance = axios.create({
  baseURL: config.coreApiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTenants = async (params: Catalog): Promise<AxiosResponse | null> => {
  try {
    return instance.get('/tenants', {
      params,
    });
  } catch (e) {
    reportError(e);
    return null;
  }
};

export const getTenant = async (id: string): Promise<AxiosResponse | void> => {
  try {
    return instance.get(`/tenant/${id}`);
  } catch (e) {
    return reportError(e);
  }
};

export const postTenants = async (body: FormData): Promise<AxiosResponse | void> => {
  try {
    return instance.post('/tenants', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (e) {
    return reportError(e);
  }
};
