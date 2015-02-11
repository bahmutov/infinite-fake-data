(function (angular) {
  'use strict';

  function infiniteFakeDataCtrl($scope, $http) {
    $scope.fetching = false;
    $scope.people = [];

    var startIndex = 0;
    var fetchNumber = 50;

    $scope.fetch = function () {
      $scope.fetching = true;

      $http.get('/people/slice/' + startIndex + '/' + (startIndex + fetchNumber))
        .success(function (response) {
          $scope.people = $scope.people.concat(response);
          if (response.length) {
            startIndex += response.length;
          }
        })
        .finally(function () {
          $scope.fetching = false;
        });
    };
    $scope.fetch();
  }

  angular.module('infinite-fake-data', ['infinite-scroll'])
    .controller('infiniteFakeDataCtrl', infiniteFakeDataCtrl);

}(angular));
