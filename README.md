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

### author

Follow Gleb Bahmutov [@twitter](https://twitter.com/bahmutov),
see his projects at [glebbahmutov.com](http://glebbahmutov.com/)
