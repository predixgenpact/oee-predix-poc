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
               // console.log(JSON.stringify($scope.tree_data));
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
                                    var tempMachineData = {
                                        'Availability': (data.siteAndAssetNumberrMapList[k][tempSiteId][l]['availabilty'] * 100),
                                        'Performance': (data.siteAndAssetNumberrMapList[k][tempSiteId][l]['performance'] * 100),
                                        'Quality Rate': (data.siteAndAssetNumberrMapList[k][tempSiteId][l]['qualityrate'] * 100 ),
                                        'OEE': (data.siteAndAssetNumberrMapList[k][tempSiteId][l]['oeePercentage'] * 100 )
                                    };
                                    // machine name
                                    temp.children[temp.children.length - 1].children.push({
                                        'Value Streams': 'Machine## ' + data.siteAndAssetNumberrMapList[k][tempSiteId][l]['assetNumberId'],
                                        'Availability': tempMachineData['Availability'] > 100 ? 100 : tempMachineData['Availability'],
                                        'Performance': tempMachineData['Performance'] > 100 ? 100 : tempMachineData['Performance'] ,
                                        'Quality Rate': tempMachineData['Quality Rate'] > 100 ? 100 :tempMachineData['Quality Rate'] ,
                                        'OEE': tempMachineData['OEE'] > 100 ? 100 : tempMachineData['OEE'] ,
                                        'Target': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['target'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['target'] : '-',
                                        'Actual': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['actual'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['actual'] : '-',
                                        'Delinquency': data.siteAndAssetNumberrMapList[k][tempSiteId][l]['delinquency'] ? data.siteAndAssetNumberrMapList[k][tempSiteId][l]['delinquency'] : '-'
                                    });
                                    tempMachineData = temp.children[temp.children.length - 1].children.slice(-1)[0];
                                    machine['Availability'] += tempMachineData['Availability'];
                                    machine['Performance'] += tempMachineData['Performance'];
                                    machine['Quality Rate'] += tempMachineData['Quality Rate'];
                                    machine['OEE'] += tempMachineData['OEE'];
                                    if (data.siteAndAssetNumberrMapList[k][tempSiteId][l]['partNumberList'].length) {
                                        temp.children[temp.children.length - 1].children[temp.children[temp.children.length - 1].children.length - 1].children = [];
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
                                        }
                                    }
                                }
                                machine['Availability'] = machine['Availability']/data.siteAndAssetNumberrMapList[k][tempSiteId].length;
                                machine['Performance'] = machine['Performance']/data.siteAndAssetNumberrMapList[k][tempSiteId].length;
                                machine['Quality Rate'] = machine['Quality Rate']/data.siteAndAssetNumberrMapList[k][tempSiteId].length;
                                machine['OEE'] = machine['OEE']/data.siteAndAssetNumberrMapList[k][tempSiteId].length;
                                temp.children[temp.children.length - 1]['Availability'] = machine['Availability'];
                                temp.children[temp.children.length - 1]['Performance'] = machine['Performance'];
                                temp.children[temp.children.length - 1]['Quality Rate'] = machine['Quality Rate'];
                                temp.children[temp.children.length - 1]['OEE'] = machine['OEE'];
                            }
                        }
                    }
                    temp['Availability'] = temp.children[0]['Availability'];
                    temp['Performance'] = temp.children[0]['Performance'];
                    temp['Quality Rate'] = temp.children[0]['Quality Rate'];
                    temp['OEE'] = temp.children[0]['OEE'];
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
            update($scope.oeeAllValueStreamsObj.filter.viewOptionConstrain);
        }

        $scope.resetFilter = function() {
            $scope.oeeAllValueStreamsObj.filter.viewOptionConstrain = [{
                name: 'Constrain Only',
                isChecked: true
            }, {
                name: 'Throughput',
                isChecked: true
            }];
            update($scope.oeeAllValueStreamsObj.filter.viewOptionConstrain);
            $scope.oeeAllValueStreamsObj.filter.applyButton = true;
            $scope.oeeAllValueStreamsObj.filter.resetButton = true;
        }

        // enable apply & reset button
        $scope.toogleResetButton = function (item) {
            $scope.oeeAllValueStreamsObj.filter.applyButton = false;
            $scope.oeeAllValueStreamsObj.filter.resetButton = false;
        }
        
        // show hide column
        function update(item) {
            if( item[0].isChecked ){
                angular.element('.vs-table tr:first-child th:nth-child(2)').show();
                angular.element('.vs-table tr td:nth-child(2), .vs-table tr:last-child th:nth-child(2)').show();
                angular.element('.vs-table tr td:nth-child(3), .vs-table tr:last-child th:nth-child(3)').show();
                angular.element('.vs-table tr td:nth-child(4), .vs-table tr:last-child th:nth-child(4)').show();
                angular.element('.vs-table tr td:nth-child(5), .vs-table tr:last-child th:nth-child(5)').show();
            } else {
                angular.element('.vs-table tr:first-child th:nth-child(2)').hide();
                angular.element('.vs-table tr td:nth-child(2), .vs-table tr:last-child th:nth-child(2)').hide();
                angular.element('.vs-table tr td:nth-child(3), .vs-table tr:last-child th:nth-child(3)').hide();
                angular.element('.vs-table tr td:nth-child(4), .vs-table tr:last-child th:nth-child(4)').hide();
                angular.element('.vs-table tr td:nth-child(5), .vs-table tr:last-child th:nth-child(5)').hide();
            }

            if( item[1].isChecked) {
                angular.element('.vs-table tr:first-child th:nth-child(3)').show();
                angular.element('.vs-table tr td:nth-child(6), .vs-table tr:last-child th:nth-child(6)').show();
                angular.element('.vs-table tr td:nth-child(7), .vs-table tr:last-child th:nth-child(7)').show();
                angular.element('.vs-table tr td:nth-child(8), .vs-table tr:last-child th:nth-child(8)').show();
            } else {
                angular.element('.vs-table tr:first-child th:nth-child(3)').hide();
                angular.element('.vs-table tr td:nth-child(6), .vs-table tr:last-child th:nth-child(6)').hide();
                angular.element('.vs-table tr td:nth-child(7), .vs-table tr:last-child th:nth-child(7)').hide();
                angular.element('.vs-table tr td:nth-child(8), .vs-table tr:last-child th:nth-child(8)').hide();
            }
        }

        function sortOrder () {

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