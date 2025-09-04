import axios from 'axios';
import type { Auth0ContextInterface } from '@auth0/auth0-react';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function authorized<T>(auth0: Auth0ContextInterface, request: () => Promise<T>): Promise<T> {
  const token = await auth0.getAccessTokenSilently();
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  return request();
}

export const defectsApi = {
  list: () => api.get('/defects').then(r => r.data),
  get: (id: string) => api.get(`/defects/${id}`).then(r => r.data),
  create: (payload: any) => api.post('/defects', payload).then(r => r.data),
  update: (id: string, payload: any) => api.patch(`/defects/${id}`, payload).then(r => r.data),
  remove: (id: string) => api.delete(`/defects/${id}`).then(r => r.data),
};
