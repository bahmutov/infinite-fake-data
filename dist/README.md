# infinite fake data

[Demo](http://glebbahmutov.com/infinite-fake-data/)

This demo shows a simple table, with data coming from mock backend.
The data is stored in the angular $scope array, bound to the table.
As the user scrolls to the bottom of the window, I use
[ng-infinite-scroll](http://binarymuse.github.io/ngInfiniteScroll/index.html)
directive to signal and fetch more data.

```html
    <tbody infinite-scroll="showMeMore()"
           infinite-scroll-distance="3"
           infinite-scroll-immediate-check="false"
           infinite-scroll-disabled="fetching">
    <tr ng-repeat="p in people">
      <td>{{$index}}</td>
      <td>{{p.email}}</td>
      <td>{{p.firstname}}</td>
      <td>{{p.lastname}}</td>
    </tr>
    </tbody>
```

The demo works as static page, since everything is compiled / runs locally.
For details data is generated and $http request is intercepted see
[index.html](http://docs.angularjs.org/api/ngMockE2E/service/$httpBackend)

## Slowing down mock respones

I have wrapped ngMockEE.$httpBackend with a proxy object
that delays executing the callback function (and thus transmitting the
result to the client code) using the approach describe
[Endless Indirection](http://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/)

```js
.config(function ($provide) {
  // delay mock backend responses by N seconds
  var DELAY_MS = 1000;
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
    for(var key in $delegate) {
      proxy[key] = $delegate[key];
    }
    return proxy;
  });
})
```

### author

Follow Gleb Bahmutov [@twitter](https://twitter.com/bahmutov),
see his projects at [glebbahmutov.com](http://glebbahmutov.com/)
