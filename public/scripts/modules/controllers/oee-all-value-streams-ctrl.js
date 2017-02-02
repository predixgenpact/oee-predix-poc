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
                show: false,
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
                    setRowColor();
                }, 10);
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
                var tempSiteMap = {
                    'Availability': 0,
                    'Performance': 0,
                    'Quality Rate': 0,
                    'OEE': 0,
                    'count': 0
                };

                // site name
                if (data.subTierSiteMap[i].length) {
                    temp.children = [];
                    for (var j = 0; j < data.subTierSiteMap[i].length; j++) {
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
                        var tempSiteName = {
                            'Availability': 0,
                            'Performance': 0,
                            'Quality Rate': 0,
                            'OEE': 0,
                            'count': 0
                        };

                        temp.children[j]['children'] = [];
                        // group by
                        for (var k in data.siteAssetGrpMap) {
                            if (data.subTierSiteMap[i][j]['siteId'] === k) {
                                for (var l = 0; l < data.siteAssetGrpMap[k].length; l++) {
                                    temp.children[j]['children'].push({
                                        'Value Streams': 'Group### ' + data.siteAssetGrpMap[k][l]['assetGroupId'],
                                        'Availability': 0,
                                        'Performance': 0,
                                        'Quality Rate': 0,
                                        'OEE': 0,
                                        'Target': '-',
                                        'Actual': '-',
                                        'Delinquency': '-'
                                    });
                                    var tempGroupData = {
                                        'Availability': 0,
                                        'Performance': 0,
                                        'Quality Rate': 0,
                                        'OEE': 0,
                                        'count': 0
                                    };
                                    // machine
                                    for (var m in data.siteAndAssetNumberrMapList) {
                                        if (data.subTierSiteMap[i][j]['siteId'] === m) {
                                            temp.children[j]['children'][l]['children'] = [];
                                            var machineDataTotal = {
                                                'Availability': 0,
                                                'Performance': 0,
                                                'Quality Rate': 0,
                                                'OEE': 0,
                                                'count': 0
                                            };
                                            for (var n = 0; n < data.siteAndAssetNumberrMapList[m].length; n++) {
                                                //serach for group id in machine data
                                                if (data.siteAssetGrpMap[k][l]['assetGroupId'] === data.siteAndAssetNumberrMapList[m][n]['assetGroupId']) {
                                                    var machineData = data.siteAndAssetNumberrMapList[m][n];
                                                    temp.children[j]['children'][l]['children'].push({
                                                        'Value Streams': 'Machine## ' + machineData['assetNumberId'],
                                                        'Availability': machineData['availabilty'],
                                                        'Performance': machineData['performance'],
                                                        'Quality Rate': machineData['qualityrate'],
                                                        'OEE': machineData['oeePercentage'],
                                                        'Target': machineData['target'] || '-',
                                                        'Actual': machineData['actual'] || '-',
                                                        'Delinquency': machineData['delinquency'] || '-'
                                                    });
                                                    var tempMachine = temp.children[j]['children'][l]['children'][temp.children[j]['children'][l]['children'].length - 1];
                                                    tempMachine['children'] = [];
                                                    // part no
                                                    for (var o = 0; o < data.siteAndAssetNumberrMapList[m][n]['partNumberList'].length; o++) {
                                                        var partNo = data.siteAndAssetNumberrMapList[m][n]['partNumberList'][o];
                                                        tempMachine['children'].push({
                                                            'Value Streams': 'Part# ' + partNo['partNumberId'],
                                                            'Availability': partNo['availabilty'] || '-',
                                                            'Performance': partNo['performance'] || '-',
                                                            'Quality Rate': partNo['qualityrate'] || '-',
                                                            'OEE': partNo['oeePercentage'] || '-',
                                                            'Target': partNo['target'] || 'XX',
                                                            'Actual': partNo['actual'] || 'XX',
                                                            'Delinquency': partNo['delinquency'] || 'XX'
                                                        });
                                                    }

                                                    machineDataTotal['Availability'] += Number(tempMachine['Availability']);
                                                    machineDataTotal['Performance'] += Number(tempMachine['Performance']);
                                                    machineDataTotal['Quality Rate'] += Number(tempMachine['Quality Rate']);
                                                    machineDataTotal['OEE'] += Number(tempMachine['OEE']);
                                                    machineDataTotal.count++;
                                                }
                                            }
                                            temp.children[j]['children'][l]['Availability'] = Math.round((machineDataTotal['Availability'] / machineDataTotal.count) * 100) / 100;
                                            temp.children[j]['children'][l]['Performance'] = Math.round((machineDataTotal['Performance'] / machineDataTotal.count) * 100) / 100;
                                            temp.children[j]['children'][l]['Quality Rate'] = Math.round((machineDataTotal['Quality Rate'] / machineDataTotal.count) * 100) / 100;
                                            temp.children[j]['children'][l]['OEE'] = Math.round((machineDataTotal['OEE'] / machineDataTotal.count) * 100) / 100;

                                            tempGroupData['Availability'] += Number(temp.children[j]['children'][l]['Availability']);
                                            tempGroupData['Performance'] += Number(temp.children[j]['children'][l]['Performance']);
                                            tempGroupData['Quality Rate'] += Number(temp.children[j]['children'][l]['Quality Rate']);
                                            tempGroupData['OEE'] += Number(temp.children[j]['children'][l]['OEE']);
                                            tempGroupData.count++;
                                        }
                                    }

                                    temp.children[j]['children'][l]['Availability'] = Math.round((tempGroupData['Availability'] / tempGroupData.count) * 100) / 100;
                                    temp.children[j]['children'][l]['Performance'] = Math.round((tempGroupData['Performance'] / tempGroupData.count) * 100) / 100;
                                    temp.children[j]['children'][l]['Quality Rate'] = Math.round((tempGroupData['Quality Rate'] / tempGroupData.count) * 100) / 100;
                                    temp.children[j]['children'][l]['OEE'] = Math.round((tempGroupData['OEE'] / tempGroupData.count) * 100) / 100;
                                    tempSiteName['Availability'] += Number(temp.children[j]['children'][l]['Availability']);
                                    tempSiteName['Performance'] += Number(temp.children[j]['children'][l]['Performance']);
                                    tempSiteName['Quality Rate'] += Number(temp.children[j]['children'][l]['Quality Rate']);
                                    tempSiteName['OEE'] += Number(temp.children[j]['children'][l]['OEE']);
                                    tempSiteName.count++;
                                }
                            }
                        }

                        temp.children[j]['Availability'] = Math.round((tempSiteName['Availability'] / tempSiteName.count) * 100) / 100;
                        temp.children[j]['Performance'] = Math.round((tempSiteName['Performance'] / tempSiteName.count) * 100) / 100;
                        temp.children[j]['Quality Rate'] = Math.round((tempSiteName['Quality Rate'] / tempSiteName.count) * 100) / 100;
                        temp.children[j]['OEE'] = Math.round((tempSiteName['OEE'] / tempSiteName.count) * 100) / 100;

                        tempSiteMap['Availability'] += Number(temp.children[j]['Availability']);
                        tempSiteMap['Performance'] += Number(temp.children[j]['Performance']);
                        tempSiteMap['Quality Rate'] += Number(temp.children[j]['Quality Rate']);
                        tempSiteMap['OEE'] += Number(temp.children[j]['OEE']);
                        tempSiteMap.count++;
                    }
                }
                if (tempSiteMap.count) {
                    temp['Availability'] = Math.round((tempSiteMap['Availability'] / tempSiteMap.count) * 100) / 100;
                    temp['Performance'] = Math.round((tempSiteMap['Performance'] / tempSiteMap.count) * 100) / 100;
                    temp['Quality Rate'] = Math.round((tempSiteMap['Quality Rate'] / tempSiteMap.count) * 100) / 100;
                    temp['OEE'] = Math.round((tempSiteMap['OEE'] / tempSiteMap.count) * 100) / 100;
                }
                tempJson.push(temp);
            }
            //console.log(tempJson);
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
        $scope.toogleResetButton = function(item) {
            $scope.oeeAllValueStreamsObj.filter.applyButton = false;
            $scope.oeeAllValueStreamsObj.filter.resetButton = false;
        }

        // show hide column
        function update(item) {
            if (item[0].isChecked) {
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

            if (item[1].isChecked) {
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

        function sortOrder() {

        }

        $scope.tableHandler = function(branch) {
            //
        }

        // set table row color
        function setRowColor(branch) {
            angular.element('.level-1').filter(':even').addClass("even-row-color");
            angular.element('.level-1').filter(':odd').addClass('odd-row-color');
        }
    }
});