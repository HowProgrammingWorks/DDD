'use strict';

const createApi = {
  ws(url, structure) {
    const socket = new WebSocket(url);
    const api = {};
    const services = Object.keys(structure);
    for (const serviceName of services) {
      api[serviceName] = {};
      const service = structure[serviceName];
      const methods = Object.keys(service);
      for (const methodName of methods) {
        api[serviceName][methodName] = (...args) => new Promise((resolve) => {
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
  },
  http(url, structure) {
    const api = {};
    const services = Object.keys(structure);
    const methodMap = {
      create: 'POST',
      update: 'PUT',
      delete: 'DELETE',
    }
    for (const serviceName of services) {
      api[serviceName] = {};
      const service = structure[serviceName];
      const methods = Object.keys(service);
      for (const methodName of methods) {
        api[serviceName][methodName] = (...args) => new Promise((resolve) => {
          let pathname = `/${serviceName}/${methodName}`;
          const method = methodMap[methodName] || 'GET';
          if (method !== 'POST') {
            pathname += `/${args[0]}`
          }
          const data = {
            method,
            headers: { 'Content-Type': 'application/json' },
          }

          if (['POST', 'PUT'].includes(method)) {
            data.body = JSON.stringify(structure[serviceName][methodName].reduce((acc, name, index) => {
              acc[name] = args[index];
              return acc;
            }, {}))
          }
          console.log(pathname, args);
          fetch(url + pathname, {
            data,
          }).then((res) => {
            const { status } = res;
            if (status !== 200) {
              reject(new Error(`Status Code: ${status}`));
              return;
            }
            resolve(res.json());
          });
        });
      }
    }
    return api;
  }
}

const scaffold = (url, structure) => {
  const transport = url.startsWith('http') ? 'http' : 'ws'
  return createApi[transport](url, structure);
};

const api = scaffold('http://127.0.0.1:8001', {
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
});

/* socket.addEventListener('open', async () => {
  const data = await api.user.read(3);
  console.dir({ data });
}); */

(async () => {
  const data = await api.user.read(1);
  console.dir({ data });
})()
