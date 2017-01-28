define(['angular', '../app-module', 'highcharts'], function(angular) {
    'use strict';
    angular.module('app.module')
        .directive('ddtDashboardHeader', ddtDashboardHeader);
    function ddtDashboardHeader () {
        return {
            restrict: 'AE',
            templateUrl: '../views/ddt-dashboard-header.html',
            scope: {
                data: "="
            },
            link: function(scope, element, attrs) {
            }
        };
    }
});