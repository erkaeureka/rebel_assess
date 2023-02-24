import axios from "axios";
import authClient from "./auth";
/*TEST ENV */
// export const BASE_URL = "http://localhost:5000/";
/*STAGING ENV */
// export const BASE_URL = "https://zozoja-developing.azurewebsites.net/";
export const BASE_URL = "https://zozoja-v1.azurewebsites.net/";
/**
 * Create a new axios client instance
 */
const getClient = (baseUrl = BASE_URL) => {
  const options = {
    baseURL: baseUrl,
  };

  if (localStorage.getItem("id_token")) {
    options.headers = {
      Authorization: `Bearer ${localStorage.getItem("id_token")}`,
    };
  }

  const client = axios.create(options);

  // // Add a request interceptor
  // client.interceptors.request.use(requestConfig => requestConfig, (requestError) => {
  //     //Raven.captureException(requestError);
  //     return Promise.reject(requestError);
  //   },
  // );

  // Add a response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      let refreshStatus = localStorage.getItem("refresh-status")
        ? parseInt(localStorage.getItem("refresh-status"))
        : 0;
      if (error.response.status === 401) {
        if (refreshStatus === 0 && localStorage.getItem("refresh_token")) {
          authClient.refreshToken();
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};
// NOTE: This doesn't seem to be used, maybe check and clean up later
class ApiClient {
  static getEnvironment = () => {
    if (BASE_URL.includes("dev")) {
      return {
        name: "DEV",
        color: "#f7b731",
      };
    } else if (BASE_URL.includes("staging")) {
      return {
        name: "STAGING",
        color: "#a55eea",
      };
    } else {
      return {
        // name: "EARLY-ACCESS", color: "#00b894",
      };
    }
  };
}

export { ApiClient };

/**
 * Base HTTP Client
 */
// eslint-disable-next-line
export default {
  // for creating a function and export the function names would cause reserved name problem - delete is a reserved word to be a function name
  // Provide request methods with the default base_url
  get: (url, conf = {}) => {
    return getClient()
      .get(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => {
        // TODO: Place wrapper function on top to handle error messages
        // TODO: Move to
        if (error.response) {
          error.message = error.response.data;
          console.error(error.response.data);
        } else {
          // TODO: Sort by response code and
          error.message = "Unknown Error";
          console.error(error.message, error);
        }
        return Promise.reject(error);
      });
  },

  delete: (url, conf = {}) => {
    return getClient()
      .delete(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  head: (url, conf = {}) => {
    return getClient()
      .head(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  options: (url, conf = {}) => {
    return getClient()
      .options(url, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  post: (url, data = {}, conf = {}) => {
    return getClient()
      .post(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => {
        // TODO: Place wrapper function on top to handle error messages
        // TODO: Move to
        if (error.response) {
          error.message = error.response.data;
        } else {
          // TODO: Sort by response code and
          error.message = "Unknown Error";
        }
        return Promise.reject(error);
      });
  },

  put: (url, data = {}, conf = {}) => {
    return getClient()
      .put(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  patch: (url, data = {}, conf = {}) => {
    return getClient()
      .patch(url, data, conf)
      .then((response) => Promise.resolve(response))
      .catch((error) => Promise.reject(error));
  },

  baseUrl: BASE_URL,
};
