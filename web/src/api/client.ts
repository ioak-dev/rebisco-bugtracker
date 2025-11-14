import axios from "axios";
import type { Auth0ContextInterface } from "@auth0/auth0-react";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function authorized<T>(
  auth0: Auth0ContextInterface,
  request: () => Promise<T>
): Promise<T> {
  const token = await auth0.getAccessTokenSilently();
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
  return request();
}

export const defectsApi = {
  list: () => api.get("/defects").then((r) => r.data),
  get: (id: string) => api.get(`/defects/${id}`).then((r) => r.data),
  create: (payload: any) => api.post("/defects", payload).then((r) => r.data),
  update: (id: string, payload: any) =>
    api.patch(`/defects/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/defects/${id}`).then((r) => r.data),
  addComment: (id: string, newComment: any) =>
    api
      .post(`/defects/${id}/comments`, { comment: newComment })
      .then((r) => r.data),
  deleteComment: (id: string, commentid: string) =>
    api.delete(`/defects/${id}/comments/${commentid}`).then((r) => r.data),
  updatecomment: (id: string, commentid: string, text: string) =>
    api
      .patch(`/defects/${id}/comments/${commentid}`, { text })
      .then((r) => r.data),
  search: (searchword: string, field: string) =>
    api.get(`/defects/search/${searchword}?field=${field}`).then((r) => r.data),
};

export const mailApi = {
  send: (payload: any) => api.post("/text-mail", payload).then((r) => r.data),
};
export const labelApi = {
  create: (id: string, payload: any) =>
    api.post(`/defects/${id}/labels`, payload).then((r) => r.data),
};
