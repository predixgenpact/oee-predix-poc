define(['angular', '../app-module'], function (angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeDashboardCtrl', OeeDashboardCtrl);
    OeeDashboardCtrl.$inject = ['$scope', '$timeout', '$window'];

    function OeeDashboardCtrl ($scope, $timeout, $window){   
        $scope.oeeDashboardObj = {
            filter: {
                show: false,
                style: {
                    height:'5px'
                }
            },
            infoCard: {
                show: true
            },
            googleMaps: {
                style: {
                    width: '100%',
                    height: '480px'  
                }
            }
        }
        $scope.oeeDashboardObj.googleMaps.style.height = $window.innerHeight-45-40+'px';

        $scope.toogleFilter = function (){
             $scope.oeeDashboardObj.filter.show = !$scope.oeeDashboardObj.filter.show;
             if( $scope.oeeDashboardObj.filter.show) {
                  $scope.oeeDashboardObj.filter.style = {
                      height: '150px'
                  }
             } else {
                $scope.oeeDashboardObj.filter.style = {
                      height: '5px'
                }
             } 
         }

         $scope.closeInfoCard = function () {
             $scope.oeeDashboardObj.infoCard.show = false;
         }

        var mapProp= {
            center:new google.maps.LatLng(51.508742,-0.120850),
            zoom:5,
        };
        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);

        angular.element($window).bind('resize', function(){
           $scope.oeeDashboardObj.googleMaps.style.height = $window.innerHeight-45-40+'px';
           $scope.$apply();
       });
    }
});