(function (angular) {
  'use strict';
  var url = '/people';

  angular.module('project', ['infinite-scroll']);

  window.ListCtrl = function($scope, $http) {
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
      console.log('show me more...');
      $scope.fetch();
    };

    $scope.fetch();
  }

}(angular));
