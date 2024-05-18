import axios, {
  AxiosError,
  RawAxiosRequestHeaders,
  AxiosResponse,
  Method,
  ResponseType,
} from "axios";
import { print } from "@/utils";

export type methodFormatRequest = {
  type?: Method;
} & formatRequest;

export type formatRequest = {
  url: string;
  headers?: RawAxiosRequestHeaders;
  body?: object;
  params?: any;
  responseType?: ResponseType;
  withCredentials?: boolean;
};

export const correctStates: number[] = [200, 201, 202, 204];
export const forbiddenStates: number[] = [401];

class ServicesClass {
  httpRequest({
    url,
    type = "get",
    headers,
    body,
    params,
    responseType,
    withCredentials = true,
  }: methodFormatRequest): Promise<AxiosResponse> {
    return axios({
      method: type,
      url: url,
      headers: headers,
      timeout: 30000,
      data: body,
      params: params,
      responseType: responseType,
      withCredentials: withCredentials,
      validateStatus(status) {
        return correctStates.some((estado: number) => status === estado);
      },
    });
  }

  isNetworkError(err: AxiosError | any) {
    return !!err.isAxiosError && !err.response;
  }

  async request({
    url,
    type = "get",
    headers,
    body,
    params,
    responseType,
    withCredentials = true,
  }: methodFormatRequest) {
    try {
      print(`enviando 🌍`, body, type, url, headers);
      const response = await this.httpRequest({
        url,
        type,
        headers,
        body,
        params,
        responseType,
        withCredentials,
      });
      print("respuesta 📡", body, type, url, response);
      return response.data;
    } catch (e: AxiosError | any) {
      if (e.code === "ECONNABORTED") {
        throw new Error("La petición está tardando demasiado");
      }

      if (this.isNetworkError(e)) {
        throw new Error("Error en la conexión 🌎");
      }

      throw e.response?.data || "Ocurrio un error desconocido";
    }
  }

  async get({
    url,
    body = {},
    headers = {},
    params,
    responseType,
    withCredentials,
  }: formatRequest) {
    return await this.request({
      url,
      type: "get",
      headers,
      body,
      params,
      responseType,
      withCredentials,
    });
  }

  async post({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: formatRequest) {
    return await this.request({
      url,
      type: "post",
      headers,
      body,
      params,
      responseType,
      withCredentials,
    });
  }

  async put({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: formatRequest) {
    return await this.request({
      url,
      type: "put",
      headers,
      body,
      params,
      responseType,
      withCredentials,
    });
  }

  async patch({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: formatRequest) {
    return await this.request({
      url,
      type: "patch",
      headers,
      body,
      params,
      responseType,
      withCredentials,
    });
  }

  async delete({
    url,
    body,
    headers,
    params,
    responseType,
    withCredentials,
  }: formatRequest) {
    return await this.request({
      url,
      type: "delete",
      headers,
      body,
      params,
      responseType,
      withCredentials,
    });
  }
}

export const Services = new ServicesClass();
