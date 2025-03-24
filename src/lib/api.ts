import axios from "axios";
import { parseCookies } from "nookies";

const { "nextauth.token": token, tenant } = parseCookies();


export const baseURL = "http://localhost:3333/";

export const api = axios.create({ baseURL });
if (token) {
  api.defaults.headers["authorization"] = `Bearer ${token}`;
}
if (tenant) {
  api.defaults.headers["x-tenant"] = tenant;
}
