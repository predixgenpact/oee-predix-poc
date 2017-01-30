define(['angular'], function (angular) {
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
                    height:'5px',
                    overflow: 'hidden'
                }
            },
            filterContent: {
                style: {
                    margin: '15px',
                    height: '35px',
                    display: 'none'
                }
            },
            filterIcon: {
                style: {
                    top:'50px'
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
            },
            disableResetFilterBtn: true,
            selectedCountries: [],
            countriesList: [{"key":"1","val":"iPhone"},{"key":"2","val":"Android"},{"key":"3","val":"Blackberry"},{"key":"4","val":"Windows Phone"},{"key":"5","val":"Flip Phone","disabled":true}]
        }
        $scope.oeeDashboardObj.googleMaps.style.height = $window.innerHeight-45-40+'px';

        $scope.toogleFilter = function (){
             $scope.oeeDashboardObj.filter.show = !$scope.oeeDashboardObj.filter.show;
             if( $scope.oeeDashboardObj.filter.show) {
                $scope.oeeDashboardObj.filter.style = {
                    height: '65px',
                    overflow: 'hidden'
                };
                $scope.oeeDashboardObj.filterIcon.style = {
                    top: '110px'
                };
                $timeout(function (){
                    $scope.oeeDashboardObj.filter.style.overflow = 'inherit';                  
                }, 600);
                $scope.oeeDashboardObj.filterContent.style.display = 'block';                    
            } else {
                $scope.oeeDashboardObj.filter.style = {
                    height: '5px',
                    overflow: 'hidden'
                };
                $scope.oeeDashboardObj.filterIcon.style = {
                    top: '50px'
                };
                $timeout(function (){
                    $scope.oeeDashboardObj.filterContent.style.display = 'none';                    
                }, 500);
            } 
        }

        $scope.closeInfoCard = function () {
             $scope.oeeDashboardObj.infoCard.show = false;
        }

        $scope.applyFilter = function () {
        }

        $scope.resetFilter = function () {
            $scope.oeeDashboardObj.disableResetFilterBtn = false;
        }

        // google maps        
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