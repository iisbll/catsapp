import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { API_BASE_URL, API_KEY } from "./constants";

export const sendRequest = async ({
  url,
  method,
  headers,
  params,
  data,
} : AxiosRequestConfig, returnHeader?: boolean) => {
  const formattedUrl = `${API_BASE_URL}${url}`;
  return axios({ method, url: formattedUrl, headers: { "x-api-key": API_KEY, ...headers }, ...data && { data }, ...params && { params }})
    .then((response: AxiosResponse) =>  returnHeader ? ({ data: response.data, headers: response.headers }) : response.data);
}