define(['angular', '../app-module'], function (angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeDashboardCtrl', OeeDashboardCtrl);
    OeeDashboardCtrl.$inject = ['$scope', '$timeout', '$window'];

    function OeeDashboardCtrl ($scope, $timeout, $window){
         angular.element('.collapsible').collapsible();
         $scope.filter = {
             show: false,
             style: {
                 height:'5px'
                }
         }
         $scope.toogleFilter = function (){
             $scope.filter.show = !$scope.filter.show;
             if( $scope.filter.show) {
                  $scope.filter.style = {
                      height: '150px'
                  }
             } else {
                $scope.filter.style = {
                      height: '5px'
                }
             } 
         }

        var mapProp= {
            center:new google.maps.LatLng(51.508742,-0.120850),
            zoom:5,
        };
        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

    }
});