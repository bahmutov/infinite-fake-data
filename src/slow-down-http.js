// delay mock backend responses by N seconds
module.exports = function slowDownHttp($provide) {
  var DELAY_MS = require('./default-delay.es6').DELAY_MS;
  if (typeof DELAY_MS !== 'number') {
    throw new Error('invalid delay ms ' + DELAY_MS);
  }

  $provide.decorator('$httpBackend', function ($delegate) {
    var proxy = function(method, url, data, callback, headers) {
      var interceptor = function() {
        var _this = this, _arguments = arguments;
        setTimeout(function() {
          // return result to the client AFTER delay
          callback.apply(_this, _arguments);
        }, DELAY_MS);
      };
      return $delegate.call(this, method, url, data, interceptor, headers);
    };
    for (var key in $delegate) {
      proxy[key] = $delegate[key];
    }
    return proxy;
  });
};
