define(['angular'], function(angular) {
    'use strict';

    /**
     * PredixUserService is a sample service which returns information about the user and if they are logged in
     */
    angular.module('app.module')
        .factory('PredixUserService', ['$q', function($q) {
            return {
                isAuthenticated: function() {
                    return this.getUserInfo();
                },
                login: function(uiState) {
                    window.px.auth.login(uiState);
                },
                getUserInfo: function() {
                    var deferred = $q.defer();
                    window.px.auth.getUserInfo().then(function(userInfo) {
                        deferred.resolve(userInfo);
                    }, function() {
                        deferred.reject();
                    });
                    return deferred.promise;
                }
            };
        }]);
});
