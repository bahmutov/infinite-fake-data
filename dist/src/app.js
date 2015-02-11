(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

if (typeof Faker === "undefined") {
  throw new Error("Cannot find Faker.js");
}

var slowDownHttp = _interopRequire(require("./slow-down-http"));

if (typeof slowDownHttp !== "function") {
  throw new Error("Cannot find slow down http function");
}

// configure the loading bar for http requests
function showLoader(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
}

function returnFakePeople($httpBackend) {
  var sliceRegExp = /\/people\/slice\/(\d+)\/(\d+)/;
  $httpBackend.whenGET(sliceRegExp).respond(function (method, url, data) {
    var indices = sliceRegExp.exec(url);
    var from = indices[1];
    var to = indices[2];

    var people = [];
    var MAX_N = to - from;
    console.assert(MAX_N >= 0, "invalid from and to indcies " + from + ", " + to);
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

angular.module("tester", ["infinite-fake-data", "ngMockE2E", "chieffancypants.loadingBar"]).config(showLoader).config(slowDownHttp).run(returnFakePeople);

},{"./slow-down-http":4}],2:[function(require,module,exports){
"use strict";

var DELAY_MS = exports.DELAY_MS = 1000; // ms
Object.defineProperty(exports, "__esModule", {
  value: true
});

},{}],3:[function(require,module,exports){
"use strict";

function infiniteFakeDataCtrl($scope, $http) {
  $scope.fetching = false;
  $scope.people = [];

  var startIndex = 0;
  var fetchNumber = 50;

  $scope.fetch = function () {
    $scope.fetching = true;

    $http.get("/people/slice/" + startIndex + "/" + (startIndex + fetchNumber)).success(function (response) {
      $scope.people = $scope.people.concat(response);
      if (response.length) {
        startIndex += response.length;
      }
    })["finally"](function () {
      $scope.fetching = false;
    });
  };
  $scope.fetch();
}

angular.module("infinite-fake-data", ["infinite-scroll"]).controller("infiniteFakeDataCtrl", infiniteFakeDataCtrl);

},{}],4:[function(require,module,exports){
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

},{"./default-delay.es6":2}]},{},[1,2,3,4]);
