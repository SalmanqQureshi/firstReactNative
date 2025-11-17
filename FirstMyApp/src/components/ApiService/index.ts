import { Server } from '../../config';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { getFormData } from '../getFormData';
import { showToast } from '../Toast';
import moment from 'moment';

let logoutHandler: (() => void) | null = null;

export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
}

// import {useNetInfo} from '@react-native-community/netinfo';

// const { type, isConnected } = useNetInfo();
type PROJECT_ENDPOINTS = string;
const axios_instance = axios.create({
  baseURL: Server.baseUrl,
  timeout: 100000,
});
// const instance = setupCache(axios_instance, { ttl: 15000, }) // 30 * 1000
const instance = axios_instance;
export const AuthToken = {
  token: '',
  // Authorization: '',
};

const CachedApis: { [key: string]: string[] } = {};

instance.interceptors.request.use(
  function (config) {
    config.headers.set('token', AuthToken.token);
    config.headers.set('Accept-Language', 'en');
    config.headers.set('Content-Type', 'multipart/form-data');
    config.headers.set('timezone', 'Asia/Karachi');
    //@ts-ignore
    if (!config.withOutAuth) {
      config.headers.set('Authorization', 'Bearer ' + AuthToken.token);
    }
    if (config.withModule) {
      config.headers.set('module', 'project');
    }
    console.log('Config======>', config);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

const NullCallback: (arg: any | undefined) => any = arg => null;

class ApiService {
  private config: AxiosRequestConfig = {
    params: {},
  };
  private shouldShowToastOnResponse = true;
  private shouldCallOnParamChange = false;
  private haveCalled = false;
  private onRequestCB = NullCallback;
  private onResponseSuccess = NullCallback;
  private onResponseFailure = NullCallback;
  private onResponseFinally = NullCallback;
  constructor(endpoint: PROJECT_ENDPOINTS, method: Method) {
    this.config = {
      ...this.config,
      url: endpoint,
      //  endpoint_hold: endpoint,
      method,
    };
  }
  withLoader() {
    return this;
  }
  withOutCache() {
    // this.config.cache = false;
    return this;
  }
  withOutAuth() {
    //@ts-ignore
    this.config.withOutAuth = true;
    return this;
  }
  withModule() {
    //@ts-ignore
    this.config.withModule = true;
    return this;
  }

  withOutToast() {
    this.shouldShowToastOnResponse = false;
    return this;
  }
  withSlug(slug: String | Number) {
    this.config.url = this.config.url + '/' + slug;
    console.log('config==========>', this.config);
    return this;
  }
  withParams(params: { [key: string]: any }) {
    this.config.params = { ...this.config.params, ...params };
    if (this.haveCalled && this.shouldCallOnParamChange) {
      (async () => {
        this.call();
      })();
    }
    return this;
  }
  withBody(JsonObject: { [key: string]: any }) {
    this.config.data = JsonObject;
    return this;
  }
  withFormData(JsonObject: { [key: string]: any }, RemoveKeys: string[] = []) {
    this.config.headers = { 'Content-Type': 'multipart/form-data' }
    this.config.data = getFormData(JsonObject, RemoveKeys);
    return this;
  }
  withReducer() {
    throw new Error('withReducer has not been Implemented!!!');
    return this;
  }
  onRequest(cb = NullCallback) {
    this.onRequestCB = cb;
    return this;
  }

  onSuccess(cb = NullCallback) {
    this.onResponseSuccess = cb;
    return this;
  }
  onFailure(cb = NullCallback) {
    this.onResponseFailure = cb;
    return this;
  }
   onFinally(cb = NullCallback) {
    this.onResponseFinally = cb;
    return this;
  }
  onUploadProgress(cb = NullCallback) {
    this.config.onUploadProgress = cb;
    return this;
  }
  onDownloadProgress(cb = NullCallback) {
    this.config.onDownloadProgress = cb;
    return this;
  }
  trackParams() {
    this.shouldCallOnParamChange = true;
    return this;
  }
  async call() {
    this.haveCalled = true;
    //     switch (this.config.method) {
    //       case 'get':
    //       case 'GET':
    //         //@ts-ignore
    //         // this.config.id = this.getCacheID();
    //         //@ts-ignore
    //         CachedApis[this.config.endpoint_hold] = !!CachedApis[
    //           this.config.endpoint_hold
    //         ]
    //           ? [...CachedApis[this.config.endpoint_hold], this.config.id]
    //           : [this.config.id];
    //         break;
    //       case 'put':
    //       case 'PUT':
    //       case 'delete':
    //       case 'DELETE':
    //       case 'head':
    //       case 'HEAD':
    //       case 'options':
    //       case 'OPTIONS':
    //       case 'post':
    //       case 'POST':
    //       case 'patch':
    //       case 'PATCH':
    //       case 'purge':
    //       case 'PURGE':
    //         if (this.config.cache != false) {
    //           //@ts-ignore
    //           this.config.cache = {update: {}};
    //           //@ts-ignore
    //           CachedApis[this.config.endpoint_hold]?.forEach(element => {
    //             //@ts-ignore
    //             this.config.cache.update[element] = 'delete';
    //           });
    //         }
    //         break;

    //       case 'link':
    //       case 'LINK':
    //       case 'unlink':
    //       case 'UNLINK':
    //     }
    console.log('====Api==================');

    try {
      this.onRequestCB(this.config);
      const response = await instance.request(this.config);

      this.onResponseSuccess(response);
      if (this.shouldShowToastOnResponse) {
        showToast({
          message: response.data.message,
          type: 'success',
        });
      }
    } catch (error) {
      let message = '';
      if (error.status == 500) {
        message = 'Something went wrong';
      } else if (error.response.status == 401 && typeof logoutHandler === 'function') {
        message = error?.response?.data?.message;
          logoutHandler(); 
      } else if (!!Object.values(error?.response?.data?.data || {}).length) {
        message = Object.values(error?.response?.data?.data).join('\n');
      } else if (!!error.response?.data?.message) {
        message = error.response?.data?.message;
      }
      // else if (!isConnected.isConnected || !isConnected.isInternetReachable) {
      //   message = 'No Internet Connection!';
      //   // type = 'info';
      // }

      //       if (this.shouldShowToastOnResponse) {
      //       }
      showToast({
        message: message,
        type: 'danger',
      });
      this.onResponseFailure(error);
    } finally{
      this.onResponseFinally()
    }
    console.log('=========================');
  }
}

export type ApiType = ApiService;

export const request = (endpoint: PROJECT_ENDPOINTS, method: Method) =>
  new ApiService(endpoint, method);