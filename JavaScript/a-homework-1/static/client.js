"use strict";

const url = "http://localhost:8001/";
const protocol = url.substring(0, url.indexOf(":"));

const scaffoldWs = (url, structure) => {
  const socket = new WebSocket(url);
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        new Promise((resolve) => {
          const packet = { name: serviceName, method: methodName, args };
          socket.send(JSON.stringify(packet));
          socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            resolve(data);
          };
        });
    }
  }
  return api;
};

const httpMethods = {
  GET: ["read"],
  PUT: ["update"],
  POST: ["create", "find"],
  DELETE: ["delete"],
};
const resolveHttpMethod = (methodName) => {
  for (const httpMethod in httpMethods) {
    if (httpMethods[httpMethod].some((name) => name === methodName)) {
      return httpMethod;
    }
  }
  return "GET";
};

const scaffoldHttp = (url, structure) => {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (...args) =>
        new Promise((resolve, reject) => {
          const methodParams = structure[serviceName][methodName];
          const methodHasInlineArg = methodParams.some(
            (el) => el === "id" || el === "mask"
          );
          const id = methodHasInlineArg ? `/${args[0]}` : "";
          const requestArgs = methodHasInlineArg ? args.splice(1) : args;
          const endpointUrl = `${url}${serviceName}/${methodName}${id}`;
          const httpMethod = resolveHttpMethod(methodName);
          const request = {
            method: httpMethod,
            headers: { "Content-Type": "application/json" },
          };
          if (["POST", "PUT"].some((item) => item === httpMethod)) {
            request.body = JSON.stringify(requestArgs[0]);
          }
          fetch(endpointUrl, request).then((res) => {
            console.log(res);
            resolve(res.json());
          });
        });
    }
  }

  return api;
};

const scaffoldOptions = {
  ws: scaffoldWs,
  http: scaffoldHttp,
};

const api = scaffoldOptions[protocol](url, {
  user: {
    create: ["record"],
    read: ["id"],
    update: ["id", "record"],
    delete: ["id"],
    find: ["mask"],
  },
  country: {
    read: ["id"],
    delete: ["id"],
    find: ["mask"],
  },
});
