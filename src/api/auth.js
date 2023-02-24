import querystring from "querystring";
import client from "./client";
import workerScript from "./worker";
import authClient from "./auth";

const descriptor = {
  client_id: "web",
  // client_secret: "841387e9-c35a-4fa9-a146-58c8b2fb2f92",
  client_secret: "841387e9-c35a-4fa9-a146-58c8b2fb2f92",
  url: "/api/connect/token",
};

const worker = new Worker(workerScript);

function auth(username, password) {
  return client
    .post(
      descriptor.url,
      querystring.stringify({
        grant_type: "password",
        username: username,
        password: password,
        scope: "offline_access",
        client_id: descriptor.client_id,
        client_secret: descriptor.client_secret,
      }),
      {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    )
    .then((response) => {
      if (response.data) {
        // enable worker only on login
        worker.onmessage = (e) => {
          if (
            localStorage.getItem("refresh_token") &&
            localStorage.getItem("expire_date")
          ) {
            if (new Date().getTime() > +localStorage.getItem("expire_date")) {
              authClient.refreshToken();
            }
          }
        };
        worker.postMessage("trying to renew refresh token");
        // store response
        localStorage.setItem("hsp-refresh-status", 0);
        localStorage.setItem("accountId", response.data.accountId);
        localStorage.setItem(
          "name",
          response.data.firstName + " " + response.data.lastName
        );
        localStorage.setItem("id_token", response.data.id_token);
        localStorage.setItem(
          "expire_date",
          new Date().setSeconds(response.data.expires_in)
        );
        localStorage.setItem("refresh_token", response.data.refresh_token);
        localStorage.setItem("lastLogin", response.data.lastLogin);
        // localStorage.setItem("roles", response.data.roles);
        localStorage.setItem(
          "roles",
          JSON.stringify(
            response.data.roles.map(function (x) {
              return x.toLowerCase();
            })
          )
        );
        localStorage.setItem("oneTimePass", response.data.oneTimePassword);
        localStorage.setItem("currentProviderId", response.data.providerId);
        localStorage.setItem("originalProviderId", response.data.providerId);
      }
      return {
        statusText: response.statusText,
        status: response.status,
      };
    })
    .catch((error) => Promise.reject(error));
}

function refreshToken() {
  // temp to seee if this fixes error
  if (
    localStorage.getItem("refresh_token") &&
    localStorage.getItem("refresh_token").length > 5
  ) {
    return client
      .post(
        descriptor.url,
        // querystring.stringify({
        //   grant_type: "refresh_token",
        //   refresh_token: localStorage.getItem("refresh_token"),
        //   client_id: descriptor.client_id,
        //   client_secret: descriptor.client_secret,
        // })
        querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: localStorage.getItem("refresh_token"),
          username: "username",
          password: "password",
          scope: "offline_access",
          client_id: descriptor.client_id,
          client_secret: descriptor.client_secret,
        })
      )
      .then((response) => {
        if (response.data) {
          localStorage.setItem("refresh-status", 0);
          localStorage.setItem("id_token", response.data.access_token);
          let date = new Date();
          date.setHours(
            date.getHours(),
            date.getMinutes(),
            date.getSeconds() + response.data.expires_in
          );
          localStorage.setItem("expire_date", date.getTime());
        }
      })
      .catch((error) => {
        console.log("response.error", error);
        localStorage.clear();
        window.location.reload();
        Promise.reject(error);
      });
  }
}

const auths = { auth, refreshToken };

export default auths;
