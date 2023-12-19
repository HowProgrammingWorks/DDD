'use strict';

const methodMap = {
    create: 'POST',
    read: 'GET',
    update: 'PUT',
    delete: 'DELETE',
    find: 'GET',
};

const buildBodyAndPathFromArgs = (args, structure, serviceName, methodName) => {
    const pathIds = ['id', 'mask'];
    const path = [];
    let body = null;
    for (let i = 0; i < args.length; i++) {
        const currArg = args[i];
        const name = structure[serviceName][methodName][i];
        if (pathIds.includes(name)) {
            path.push(`${currArg}`);
        } else {
            body = currArg;
        }
    }
    return {body, path: path.join('/')};
};

const httpScaffold = (url, structure) => {
    const api = {};
    const services = Object.keys(structure);
    for (const serviceName of services) {
        api[serviceName] = {};
        const service = structure[serviceName];
        const methods = Object.keys(service);
        for (const methodName of methods) {
            api[serviceName][methodName] = (...args) => {
                const {path, body} = buildBodyAndPathFromArgs(args, structure, serviceName, methodName);
                return fetch(`${url}/${serviceName}/${methodName}/${path}`, {
                    method: methodMap[methodName],
                    body: body ? JSON.stringify(body) : null,
                }).then((res) => {
                    if (res.status !== 200) throw new Error(`Response code ${res.status}`);
                    return res.json();
                });
            }
        }
    }
    return api;
};

const wssScaffold = (url, structure) => {
    const api = {};
    const services = Object.keys(structure);
    for (const serviceName of services) {
        api[serviceName] = {};
        const service = structure[serviceName];
        const methods = Object.keys(service);
        for (const methodName of methods) {
            api[serviceName][methodName] = (...args) => new Promise((resolve) => {
                const packet = {name: serviceName, method: methodName, args};
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

const scaffold = (url, structure) => {
    const protocol = new URL(url).protocol;
    if (protocol === 'http:') return httpScaffold(url, structure);
    if (protocol === 'ws:') return wssScaffold(url, structure);
    throw new Error(`Unknown protocol ${protocol}`);
};

const api = scaffold('ws://localhost:3000', {
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

(async () => {
    const [{id}] = await api.user.create({login: 'rand1', password: 'test'});
    const [user] = await api.user.read(id);
    console.log(user);
})();