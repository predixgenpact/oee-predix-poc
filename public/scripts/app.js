/**
 * Load controllers, directives, filters, services before bootstrapping the application.
 * NOTE: These are named references that are defined inside of the config.js RequireJS configuration file.
 */
define([
    'jquery',
    'angular',
    'main',
    'routes',
    'interceptors',
    'px-datasource',
    'ng-bind-polymer',
    'angular-animate',
    'materialize'
], function ($, angular) {
    'use strict';
    /**
     * Application definition
     * This is where the AngularJS application is defined and all application dependencies declared.
     * @type {module}
     */
    var predixApp = angular.module('predixApp', [
        'app.routes',
        'app.interceptors',
        'app.module',
        'predix.datasource',
        'px.ngBindPolymer',
        'ngAnimate'
    ]);

    /**
     * Main Controller
     * This controller is the top most level controller that allows for all
     * child controllers to access properties defined on the $rootScope.
     */
    predixApp.controller('MainCtrl', ['$scope', '$rootScope', 'PredixUserService', function ($scope, $rootScope, predixUserService) {

        //Global application object
        window.App = $rootScope.App = {
            version: '1.0',
            name: 'Predix Seed',
            session: {},
            tabs: [
                {icon: 'fa-tachometer', state: 'defectRatio', label: 'Dashboards', subitems: [
                    {state: 'defectRatio', label: 'Defect Ratio Dashboard'},
                    {state: 'defectPattern', label: 'Defect Pattern Dashboard'},
                    {state: 'debriefTool', label: 'Defect Review Tool'}
                ]},
                {icon: 'fa-file-o', state: 'feDefect', label: 'FE Defect%'},
                {icon: 'fa-file-o', state: 'eagmRawData', label: 'EAGM 2016 Raw Data'},
                {icon: 'fa-file-o', state: 'detailedGraphs', label: 'Detailed Graphs'},
                {icon: 'fa-file-o', state: 'feedback', label: 'Send Feedback%'}
            ]
        };

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'UNAUTHORIZED':
                        //redirect
                        predixUserService.login(toState);
                        break;
                    default:
                        //go to other error state
                }
            }
            else {
                // unexpected error
            }
        });
    }]);

    //Set on window for debugging
    window.predixApp = predixApp;

    //Return the application  object
    return predixApp;
});
