"use strict";

const url = "ws://localhost:8001/";
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
          const methodHasIdArg = methodParams.some((el) => el === "id");
          const id = methodHasIdArg ? `/${args[0]}` : "";
          const requestArgs = methodHasIdArg ? args.splice(1) : args;
          const endpointUrl = `${url}${serviceName}/${methodName}${id}`;
          fetch(endpointUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestArgs),
          }).then((res) => {
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
