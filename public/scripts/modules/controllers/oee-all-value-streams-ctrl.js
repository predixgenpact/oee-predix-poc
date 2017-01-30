define(['angular', '../app-module'], function (angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeAllValueStreamsCtrl', OeeAllValueStreamsCtrl);
    OeeAllValueStreamsCtrl.$inject = ['$scope', '$timeout', '$window'];

    function OeeAllValueStreamsCtrl ($scope, $timeout, $window){   
        $scope.oeeAllValueStreamsObj = {
            table: {
                row: {
                    show: false
                }
            }
        }

        $scope.toggleTableRow = function (row) {
            if (row) {
                document.getElementById(row).style.display = 'table-row';                
            }
        }
    }
});