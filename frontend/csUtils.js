const csApi = (function () {

    const api = {};
    const baseUrl = 'https://dea.staging.credsimple.com';
    const path = '/v1/clients_providers/';
    const token = '3ad6aef59ee542ec881c5bc6593ba9c3';
    const id = 20;

    api.getData = function () {
        return new Promise((resolve, reject) => {
            let requestUrl = `${baseUrl}${path}${id}?token=${token}`;
            let request = new XMLHttpRequest();
            request.open('get', requestUrl, true);

            request.onload = function () {
                resolve(JSON.parse(request.response));
            };
            request.onerror = function (e) {
                reject(e)
            }

            request.send();
        });

    };

    return api;

})();
