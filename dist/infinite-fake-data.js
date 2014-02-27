(function (angular) {
  'use strict';
  var url = '/people';

  angular.module('infinite-fake-data', ['infinite-scroll']);

  window.infiniteFakeDataCtrl = function($scope, $http) {
    $scope.fetching = false;
    $scope.people = [];

    var startIndex = 0;
    var fetchNumber = 50;

    $scope.fetch = function () {
      $scope.fetching = true;

      $http.get(url + '/slice/' + startIndex + '/' + (startIndex + fetchNumber))
      .success(function (response) {
        $scope.people = $scope.people.concat(response);
        if (response.length) {
          startIndex += fetchNumber;
        }
        $scope.fetching = false;
      });
    };

    $scope.showMeMore = function () {
      $scope.fetch();
    };

    $scope.fetch();
  }

}(angular));
