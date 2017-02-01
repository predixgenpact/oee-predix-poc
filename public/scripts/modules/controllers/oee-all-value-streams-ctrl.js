define(['angular', '../app-module', '../services/oee-supply-chain-service'], function(angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeAllValueStreamsCtrl', OeeAllValueStreamsCtrl);
    OeeAllValueStreamsCtrl.$inject = ['$scope', '$timeout', '$window', 'OeeSupplyChainService'];

    function OeeAllValueStreamsCtrl($scope, $timeout, $window, OeeSupplyChainService) {
        angular.element("#ui-view").hide();
        //angular.element(".page-loading").removeClass("hidden");

        $scope.oeeAllValueStreamsObj = {
            filter: {
                style: {
                    height: '5px',
                    overflow: 'hidden',
                },
                applyButton: true,
                resetButton: true,
                show: false,
                sortByOptions: ['Constraints', 'Alphabetically'],
                selectedOptions: '',
                viewOptionConstrain: [{
                    name: 'Constrain Only',
                    isChecked: true
                }, {
                    name: 'Throughput',
                    isChecked: true
                }]
            },
            filterIcon: {
                style: {
                    top: '50px',
                    left: '50px',
                    right: '50px',
                    width: '80%'
                },
                show: false
            },
            table: {
                row: {
                    show: false
                },
                showOeeCol: true,
                showThroughputCol: true
            }
        }
        $scope.tree_data = [{
            "Value Streams": "",
            "Availability": 0,
            "Performance": 0,
            "Quality Rate": 0,
            "OEE": 0,
            "Target": "-",
            "Actual": "-",
            "Delinquency": "-"
        }];
        // load table data
        var childUrl = 'https://overallequipmenteffectiveness-supplychain.run.aws-usw02-pr.ice.predix.io/oee/OeeAllValueStreams';
        OeeSupplyChainService.getSupplyChainServiceData(childUrl)
            .then(function(response) {
                $scope.tree_data = angular.copy(makeTableJson(response));
                //console.log(JSON.stringify($scope.tree_data));
                angular.element(".page-loading").addClass("hidden");
                angular.element("#ui-view").show();

                //adding header in table once table is rendered in DOM
                $timeout(function() {
                    angular.element('.vs-table table thead').prepend('<tr> <th></th>\
                <th colspan="4"> Overall Equipment Effectiveness</th> <th colspan="3"> Throughput</th></tr>');
                    $scope.setRowColor();
                }, 100);
            }, function(error) {
                console.log('Failed to fetch data');
            });

        function makeTableJson(data) {
            var tempJson = [];


            for (var i in data.subTierSiteMap) {
                // sit map - main
                var temp = {
                    'Value Streams': i,
                    'Availability': 0,
                    'Performance': 0,
                    'Quality Rate': 0,
                    'OEE': 0,
                    'Target': '-',
                    'Actual': '-',
                    'Delinquency': '-'
                };
                if (data.subTierSiteMap[i].length) {
                    temp.children = [];
                    for (var j = 0; j < data.subTierSiteMap[i].length; j++) {
                        for (var k = 0; k < data.siteAndAssetNumberrMapList.length; k++) {
                            var tempSiteId = Object.keys(data.siteAndAssetNumberrMapList[k])[0];
                            if (tempSiteId === data.subTierSiteMap[i][j]['siteId']) {
                                // site name
                                temp.children.push({
                                    'Value Streams': data.subTierSiteMap[i][j]['siteId'],
                                    'Availability': 0,
                                    'Performance': 0,
                                    'Quality Rate': 0,
                                    'OEE': 0,
                                    'Target': '-',
                                    'Actual': '-',
                                    'Delinquency': '-'
                                });
                                var machine = {
                                    'Availability': 0,
                                    'Performance': 0,
                                    'Quality Rate': 0,
                                    'OEE': 0,
                                    'Target': '-',
                                    'Actual': '-',
                                    'Delinquency': '-'
                                }
                                temp.children[temp.children.length - 1].children = [];
                                for (var l = 0; l < data.siteAndAssetNumberrMapList[k][tempSiteId].length; l++) {
                                    // machine name
                                    //console.log(data.siteAndAssetNumberrMapList[k][tempSiteId][l]['availabilty']);
                                    temp.children[temp.children.length - 1].children.push({
                                        'Value Streams': 'Machine## ' + data.siteAndAssetNumberrMapList[k][tempSiteId][l]['assetNumberId'],
                                        'Availability': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['availabilty'],
                                        'Performance': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['performance'],
                                        'Quality Rate': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['qualityrate'],
                                        'OEE': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['oeePercentage'],
                                        'Target': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['target'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['target'] : '-',
                                        'Actual': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['actual'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['actual'] : '-',
                                        'Delinquency': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['delinquency'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['delinquency'] : '-'
                                    });
                                    if (data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'].length) {
                                        //temp.children[temp.children.length - 1].children[temp.children[temp.children.length - 1].children.length - 1].children = [];
                                        temp.children[temp.children.length - 1].children[temp.children[temp.children.length - 1].children.length - 1].children = [];
                                        //console.log(temp.children[temp.children.length - 1].children.children);
                                        var parts = {
                                            'Availability': 0,
                                            'Performance': 0,
                                            'Quality Rate': 0,
                                            'OEE': 0,
                                            'Target': 0,
                                            'Actual': 0,
                                            'Delinquency': 0
                                        }
                                        //console.log(data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'].length);
                                        for (var m = 0; m < data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'].length; m++) {
                                            // parts
                                            temp.children[temp.children.length - 1].children[temp.children[temp.children.length - 1].children.length - 1].children.push({
                                                'Value Streams': 'Part# ' + data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['partNumberId'],
                                                'Availability': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['availabilty'],
                                                'Performance': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['performance'],
                                                'Quality Rate': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['qualityrate'],
                                                'OEE': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['oeePercentage'],
                                                'Target': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['target'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['target'] : '-',
                                                'Actual': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['actual'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['actual'] : '-',
                                                'Delinquency': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['delinquency'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['delinquency'] : '-'
                                            });
                                            parts['Availability'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['availabilty'];
                                            parts['Performance'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['performance'];
                                            parts['Quality Rate'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['qualityrate'];
                                            parts['OEE'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'][m]['oeePercentage'];
                                        }
                                        // temp.children[temp.children.length - 1].children.children[temp.children[temp.children.length - 1].children.children.length-1]['Availability'] = parts['Availability'];
                                        // temp.children[temp.children.length - 1].children.children[temp.children[temp.children.length - 1].children.children.length-1]['Performance'] = parts['Performance'];
                                        // temp.children[temp.children.length - 1].children.children[temp.children[temp.children.length - 1].children.children.length-1]['Quality Rate'] = parts['Quality Rate'];
                                        // temp.children[temp.children.length - 1].children.children[temp.children[temp.children.length - 1].children.children.length-1]['OEE'] = parts['OEE'];
                                    }
                                    /*machine['Availability'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['availabilty'];
                                    machine['Performance'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['performance'];
                                    machine['Quality Rate'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['qualityrate'];
                                    machine['OEE'] += data.siteAndAssetNumberrMapList[k][tempSiteId][l]['oeePercentage'];*/
                                }
                                //	console.log(temp.children[temp.children.length - 1]);
                            }
                        }
                    }
                }
                tempJson.push(temp);
            }
            return tempJson;
        }

        // show/hide filter
        $scope.toogleFilter = function() {
            $scope.oeeAllValueStreamsObj.filter.show = !$scope.oeeAllValueStreamsObj.filter.show;
            $scope.oeeAllValueStreamsObj.table.showThroughputCol = !$scope.oeeAllValueStreamsObj.table.showThroughputCol;
            $scope.oeeAllValueStreamsObj.table.showOeeCol = !$scope.oeeAllValueStreamsObj.table.showOeeCol;

            if ($scope.oeeAllValueStreamsObj.filter.show) {
                $scope.oeeAllValueStreamsObj.filter.style = {
                    height: '55px',
                    overflow: 'hidden'
                };
                $scope.oeeAllValueStreamsObj.filterIcon.style = {
                    top: '100px',
                    left: '50px',
                    right: '50px',
                    width: '80%'
                };
                $timeout(function() {
                    $scope.oeeAllValueStreamsObj.filter.style.overflow = 'inherit';
                }, 600);
            } else {
                $scope.oeeAllValueStreamsObj.filter.style = {
                    height: '5px',
                    overflow: 'hidden'
                };
                $scope.oeeAllValueStreamsObj.filterIcon.style = {
                    top: '50px',
                    left: '50px',
                    right: '50px',
                    width: '80%'
                };
            }
        }

        $scope.applyFilter = function() {
            $scope.oeeAllValueStreamsObj.filter.applyButton = true;
            $scope.oeeAllValueStreamsObj.filter.resetButton = true;
            if ($scope.oeeAllValueStreamsObj.filter.viewOptionConstrain[0]['isChecked']) {

            }
            if ($scope.oeeAllValueStreamsObj.filter.viewOptionConstrain[0]['isChecked']) {

            }
        }

        $scope.resetFilter = function() {
            $scope.oeeAllValueStreamsObj.filter.viewOptionConstrain = [{
                name: 'Constrain Only',
                isChecked: true
            }, {
                name: 'Throughput',
                isChecked: true
            }];
            $scope.oeeAllValueStreamsObj.filter.applyButton = true;
            $scope.oeeAllValueStreamsObj.filter.resetButton = true;
        }

        // enable apply & reset button
        $scope.update = function(item) {
            $scope.oeeAllValueStreamsObj.filter.applyButton = false;
            $scope.oeeAllValueStreamsObj.filter.resetButton = false;
        }

        $scope.tableHandler = function(branch) {
            //
        }

        // set table row color
        $scope.setRowColor = function(branch) {
            angular.element('.level-1').filter(':even').addClass("even-row-color");
            angular.element('.level-1').filter(':odd').addClass('odd-row-color');
        }
    }
});