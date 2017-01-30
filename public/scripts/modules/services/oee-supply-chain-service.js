define(['angular', '../app-module'], function(angular) {
    'use strict';

    angular.module('app.module')
        .factory('OeeSupplyChainService', ['$q', '$http', function($q, $http) {
            return {
                getSupplyChainServiceData : function (childUrl) {
                    var deferred = $q.defer();
                      $http.get(childUrl)
                        .success(function (data) {
                            deferred.resolve(data);
                        })
                        .error(function() {
                            deferred.reject('Error fetching data ');
                        });
                    return deferred.promise;
                }
            }
        }]);
});
