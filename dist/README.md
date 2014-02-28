# infinite fake data

[Demo](http://glebbahmutov.com/infinite-fake-data/)

This demo shows a simple table, with data coming from in-page mock backend,
where each request is slowed down by 1 second.
The received data is stored in the angular $scope array, bound to the table.
The demo works as static page, since everything is compiled / runs locally.

## Loading the data

The controller function attached to the page just calls the backend url,
keeping track of the next slice of data to request

```js
$scope.fetch = function () {
  $scope.fetching = true;
  $http.get(url + '/slice/' + startIndex + '/' + (startIndex + fetchNumber))
  .success(function (response) {
    $scope.people = $scope.people.concat(response);
    if (response.length) {
      startIndex += response.length;
    } // else there is no more data
    $scope.fetching = false;
  });
};
```

## Making fetch request on scroll

As the user scrolls to the bottom of the window, I use
[ng-infinite-scroll](http://binarymuse.github.io/ngInfiniteScroll/index.html)
directive to signal and fetch more data.

```html
    <tbody infinite-scroll="fetch()"
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

For details how mock data is generated and $http request is intercepted see
the [index.html](index.html) source.

## Serving mock data

Having to run back server to return data is a big requirement.
Luckily just to show that the frontend is working, we could intercept AJAX
requests in-page using
[ngMockE2E.$httpBackend](http://docs.angularjs.org/api/ngMockE2E/service/$httpBackend)
class.

Whenever a request is intercepted (by matching it to a RegExp to account for changing range indices),
we generate an array of fake data using [Faker.js](https://github.com/marak/Faker.js/) and
return it:

```js
angular.module('tester', ['infinite-fake-data', 'ngMockE2E'])
.run(function ($httpBackend) {
  var sliceRegExp = /\/people\/slice\/(\d+)\/(\d+)/;
  $httpBackend.whenGET(sliceRegExp).respond(function (method, url, data) {
    var indices = sliceRegExp.exec(url);
    var from = indices[1];
    var to = indices[2];
    var people = [];
    var MAX_N = to - from;
    console.assert(MAX_N >= 0, 'invalid from and to indcies ' + from + ', ' + to);
    for(var k = 0; k < MAX_N; k += 1) {
      var person = {
        email: Faker.Internet.email(),
        firstname: Faker.Name.firstName(),
        lastname: Faker.Name.lastName()
      };
      people.push(person);
    }
    return [200, people];
  });
});
```

## Slowing down mock respones

Returning mock data almost instantenously from in-page mock does not
reflect how the directive behaves in realistic network conditions:
requests take time, depending on the conditions. To properly mock
the network delays, I slowed down mock backend responses.

I have wrapped ngMockE2E.$httpBackend with a proxy object
that delays executing the callback function (and thus transmitting the
result to the client code) using the approach describe
[Endless Indirection](http://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/)

```js
.config(function ($provide) {
  // delay mock backend responses by 1 second
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
