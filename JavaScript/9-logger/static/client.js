'use strict';

const HTTP_API_URL = 'http://localhost:8001';
let socket;

const transports = {
  ws: (name, method) => {
    if (!socket) socket = new WebSocket('ws://127.0.0.1:8001/');
    return (...args) => {
      return new Promise((resolve) => {
        const packet = { name, method, args };
        socket.send(JSON.stringify(packet));
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          resolve(data);
        };
      });
    };
  },

  http:
    (name, method, methodArgs) =>
    (...args) => {
      const urlParts = [HTTP_API_URL, name, method];
      if (methodArgs[0] === 'id') urlParts.push(args.shift());

      return fetch(urlParts.join('/'), {
        method: 'POST',
        body: JSON.stringify(args),
      }).then((response) => response.json());
    },
};

const scaffold = (structure, transport) => {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = transport(
        serviceName,
        methodName,
        service[methodName],
      );
    }
  }
  return api;
};

const api = scaffold(
  {
    user: {
      create: ['record'],
      read: ['id'],
      update: ['id', 'record'],
      delete: ['id'],
      find: ['mask'],
    },
    country: {
      read: ['id'],
      delete: ['id'],
      find: ['mask'],
    },
  },
  transports.http,
);

// socket.addEventListener('open', async () => {
//   const data = await api.user.read(3);
//   console.dir({ data });
// });

(async () => console.log(await api.user.read(3)))();
