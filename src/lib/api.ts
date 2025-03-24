import axios from "axios";
import { parseCookies } from "nookies";

const { "nextauth.token": token, tenant } = parseCookies();


export const baseURL = "https://fullnext-connect-api.onrender.com/";

export const api = axios.create({ baseURL });
if (token) {
  api.defaults.headers["authorization"] = `Bearer ${token}`;
}
if (tenant) {
  api.defaults.headers["x-tenant"] = tenant;
}
