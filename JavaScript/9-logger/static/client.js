'use strict';

function scaffoldIterator(structure, handler) {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = handler(serviceName, methodName, structure[serviceName][methodName]);
    }
  }
}

const scaffoldHttp = (url, structure) => {
  const api = {};
  scaffoldIterator(structure, (serviceName, methodName) => {
    if (!api[serviceName]) {
      api[serviceName] = {}
    }
    api[serviceName][methodName] = (...args) => fetch(`${url}/${serviceName}/${methodName}`,{
      method: 'POST',
      body: JSON.stringify({ data: args })
    })
  })
  return Promise.resolve(api);
}

const scaffoldWs = (url, structure) => {
  const socket = new WebSocket(url);
  const api = {};
  scaffoldIterator(structure, (serviceName, methodName) => {
    if (!api[serviceName]) {
      api[serviceName] = {}
    }
    api[serviceName][methodName] = (...args) => new Promise((resolve) => {
      const packet = { name: serviceName, method: methodName, args };
      socket.send(JSON.stringify(packet));
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        resolve(data);
      };
    });
  })
  return new Promise(resolve => {
    socket.addEventListener('open', async () => {
      resolve(api)
    });
  });
};

function scaffold(url, structure) {
  return url.startsWith('ws') ? scaffoldWs(url, structure) : scaffoldHttp(url, structure)
}

let api;

scaffold('http://127.0.0.1:8001',{
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
}).then(result => api = result)
