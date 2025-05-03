import axios from "axios";

export const axiosClient = axios.create({ baseURL: `${import.meta.env.PROD ? "" : "http://localhost:3000"}/api` });
