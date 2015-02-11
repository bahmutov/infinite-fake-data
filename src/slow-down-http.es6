// delay mock backend responses by N seconds
export function slowDownHttp($provide) {
  var DELAY_MS = 1000; // ms
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
}
