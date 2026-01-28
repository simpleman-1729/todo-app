import axios from "axios";

const api = axios.create({
  baseURL: "/api",               
});
export default api;


/* for local macine to poit baseURL to baseURL: process.env.REACT_APP_API_URL, */