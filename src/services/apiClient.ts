import axios from "axios";

// let isRefreshing = false;
// let failedRequestQueue = [];

const limit = 20;

let baseURL = "";

if (process.env.REACT_APP_API_URL) {
  if (process.env.REACT_APP_API_URL.startsWith("https")) {
    baseURL = `${process.env.REACT_APP_API_URL}/api`;
  } else if (process.env.REACT_APP_API_URL.startsWith("http")) {
    baseURL = process.env.REACT_APP_API_URL;
  }
} else {
  baseURL = "http://localhost:3333";
}

export function apiClient() {
  //   const token = getStorageModel(auth.TOKEN);
  //   const restoreUser = getStorageModel(auth.USER);
  //   const user = JSON.parse(restoreUser);

  const api = axios.create({
    baseURL,
    headers: {
      //   Authorization: `Bearer ${token}`,
      //   userId: user.userId,
      ContentType: "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
    },
  });

  api.interceptors.request.use(
    (request: any) => {
      if (request.method?.toLowerCase() === "get") {
        request.headers.limit = request.headers.limit ?? String(limit);
      }

      return request;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log("Error message:", error.message);
      console.log("Error config:", error.config);
      console.log("Error response:", error.response);
      return Promise.reject(error);
    }
  );

  return api;
}
