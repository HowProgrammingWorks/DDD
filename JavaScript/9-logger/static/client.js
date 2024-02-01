'use strict';

const API_URL = 'ws://localhost:8001';

const getTransport = (url) => {
  let socket;
  const protocol = url.split(':')[0];

  const transports = {
    ws: (name, method) => {
      if (!socket) socket = new WebSocket(url);
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
        const urlParts = [url, name, method];
        if (methodArgs[0] === 'id') urlParts.push(args.shift());

        return fetch(urlParts.join('/'), {
          method: 'POST',
          body: JSON.stringify(args),
        }).then((response) => response.json());
      },
  };

  return transports[protocol];
};

const scaffold = (url, structure) => {
  const transport = getTransport(url);
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

const api = scaffold(API_URL, {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  city: {
    read: ['id'],
    create: ['record'],
    update: ['id', 'record'],
    delete: ['id'],
  },
  country: {
    read: ['id'],
    create: ['record'],
    update: ['id', 'record'],
    delete: ['id'],
  },
});

// socket.addEventListener('open', async () => {
//   const data = await api.user.read(3);
//   console.dir({ data });
// });

(async () => console.log(await api.user.read(3)))();
