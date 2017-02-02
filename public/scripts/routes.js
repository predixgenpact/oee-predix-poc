/**
 * Router Config
 * This is the router definition that defines all application routes.
 */
define(['angular', 'angular-ui-router'], function(angular) {
    'use strict';
    return angular.module('app.routes', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        //Turn on or off HTML5 mode which uses the # hash
        $locationProvider.html5Mode(true).hashPrefix('!');

        /**
         * Router paths
         * This is where the name of the route is matched to the controller and view template.
         */
        $stateProvider
            /*.state('secure', {
                template: '<ui-view/>',
                abstract: true,
                resolve: {
                    authenticated: ['$q', 'PredixUserService', function ($q, predixUserService) {
                        var deferred = $q.defer();
                        predixUserService.isAuthenticated().then(function(userInfo){
                            deferred.resolve(userInfo);
                        }, function(){
                            deferred.reject({code: 'UNAUTHORIZED'});
                        });
                        return deferred.promise;
                    }]
                }
            })*/
            .state('dashboard', {
                //parent: 'secure',
                url: '/',
                templateUrl: 'views/oee-dashboard.html',
                controller: 'OeeDashboardCtrl'
            }).state('oeeSummary', {
                //parent: 'secure',
                url: '/oeeSummary', 
                templateUrl: 'views/oee-Sumamry.html',
                controller: 'oeeSummaryCtrl'
            })
            .state('valueStreams', {
                //parent: 'secure',
                url: '/valueStreams',
                templateUrl: 'views/oee-all-value-streams.html',
                controller: 'OeeAllValueStreamsCtrl'
            });
;

        // $urlRouterProvider.otherwise(function ($injector) {
        //     var $state = $injector.get('$state');
        //     document.querySelector('px-app-nav').markSelected('/');
        //     $state.go('defectRatio');
        // });

        $urlRouterProvider.otherwise('/');
    }]);
});
