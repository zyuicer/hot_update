import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface AxiosInterceptorInstance extends AxiosRequestConfig {
  interceptors?: {
    responseInterceptor?: (res: AxiosResponse) => AxiosResponse;
    responseCatchInterceptor?: (err: unknown) => unknown;

    requestInterceptor?: (
      req: InternalAxiosRequestConfig,
    ) => InternalAxiosRequestConfig;
    requestCatchInterceptor?: (err: unknown) => unknown;
  };
}

export class Request {
  instance: AxiosInstance;
  config: AxiosInterceptorInstance;
  constructor(config: AxiosInterceptorInstance) {
    this.config = config;
    this.instance = axios.create(config);
    this.instance.interceptors.request.use(
      this.requestInterceptor.bind(this),
      config.interceptors?.requestCatchInterceptor,
    );

    this.instance.interceptors.response.use(
      this.responseInterceptor.bind(this),
      config.interceptors?.responseInterceptor,
    );
  }

  private requestInterceptor(req: InternalAxiosRequestConfig) {
    if (this.config?.interceptors?.requestInterceptor) {
      req = this.config.interceptors.requestInterceptor(req);
    }
    return req;
  }

  private responseInterceptor(res: AxiosResponse) {
    if (this.config.interceptors?.responseInterceptor) {
      res = this.config.interceptors.responseInterceptor(res);
    }
    return res;
  }

  post<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "POST" });
  }

  DELETE<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "DELETE" });
  }

  get<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "GET" });
  }

  put<T>(config: AxiosRequestConfig) {
    return this.request<T>({ ...config, method: "PUT" });
  }
  request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance
        .request(config)
        .then(res => {
          resolve(res as T);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export interface RestFuiApi<T> {
  code: number;
  data: T;
  msg?: string;
}
export function defineRequest(baseConfig: AxiosInterceptorInstance) {
  return new Request(baseConfig);
}
