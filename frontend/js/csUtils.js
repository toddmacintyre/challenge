var csApi = function () {

  var api = {},
    baseUrl = 'https://dea.staging.credsimple.com',
    path = '/v1/clients_providers/',
    token = '3ad6aef59ee542ec881c5bc6593ba9c3',
    id = 20;

  api.getData = function (callback) {
    requestUrl = baseUrl + path + id + '?token=' + token;
    request = new XMLHttpRequest();
    request.open('get', requestUrl, true);
    request.onload = function (e) {
      var response = request.response;
      response = JSON.parse(response);
      if (callback)
        callback(response);
    };
    request.onerror = function (e) {
      console.log(request.response, e);
    };
    request.send();
  }

  return api;

}();
