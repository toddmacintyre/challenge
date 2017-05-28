const csApi = (function  () {

  const api = {}
  const baseUrl = 'https://dea.staging.credsimple.com'
  const path = '/v1/clients_providers/'
  const token = '3ad6aef59ee542ec881c5bc6593ba9c3'
  const id = 20;

  api.getData = function(callback) {
    const requestUrl = baseUrl + path + id + '?token=' + token;
    const request = new XMLHttpRequest();
    request.open('get', requestUrl, true);
    request.onload = function(e) {
      let response = request.response;
      response = JSON.parse(response);
      callback(response);
    };
    request.onerror = function(e) {
      callback(request.response, e);
    };
    request.send();
  };

  return api;

})();

module.exports = csApi;
