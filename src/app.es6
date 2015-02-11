if (typeof Faker === 'undefined') {
  throw new Error('Cannot find Faker.js');
}

import { slowDownHttp } from './slow-down-http.es6';

// configure the loading bar for http requests
function showLoader(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}

function returnFakePeople($httpBackend) {
  var sliceRegExp = /\/people\/slice\/(\d+)\/(\d+)/;
  $httpBackend.whenGET(sliceRegExp).respond(function(method, url, data) {
    var indices = sliceRegExp.exec(url);
    var from = indices[1];
    var to = indices[2];

    var people = [];
    var MAX_N = to - from;
    console.assert(MAX_N >= 0, 'invalid from and to indcies ' + from + ', ' + to);
    for (var k = 0; k < MAX_N; k += 1) {
      var person = {
        email: Faker.Internet.email(),
        firstname: Faker.Name.firstName(),
        lastname: Faker.Name.lastName()
      };
      people.push(person);
    }
    return [200, people];
  });
}

angular.module('tester', ['infinite-fake-data', 'ngMockE2E', 'chieffancypants.loadingBar'])
  .config(showLoader)
  .config(slowDownHttp)
  .run(returnFakePeople);
