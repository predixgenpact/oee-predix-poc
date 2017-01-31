define(['angular', '../app-module'], function(angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeAllValueStreamsCtrl', OeeAllValueStreamsCtrl);
    OeeAllValueStreamsCtrl.$inject = ['$scope', '$timeout', '$window'];

    function OeeAllValueStreamsCtrl($scope, $timeout, $window) {
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


        // table Json
        $scope.tree_data = [{
                'Value Streams': "Rotating parts & Compressor Airfoils",
                'Availability': "XX%",
                'Performance': "XX%",
                'Quality Rate': "XX%",
                'OEE': "XX%",
                'Target': '-',
                'Actual': '-',
                'Delinquency': '-',
                children: [{
                    'Value Streams': "Site Name",
                    'Availability': "XX%",
                    'Performance': "XX%",
                    'Quality Rate': "XX%",
                    'OEE': "XX%",
                    'Target': '-',
                    'Actual': '-',
                    'Delinquency': '-',
                    children: [{
                        'Value Streams': "Machine ##",
                        'Availability': "XX%",
                        'Performance': "XX%",
                        'Quality Rate': "XX%",
                        'OEE': "XX%",
                        'Target': '-',
                        'Actual': '-',
                        'Delinquency': '-',
                        children: [{
                                'Value Streams': "Part # XXXX001",
                                'Availability': "-",
                                'Performance': "-",
                                'Quality Rate': "-",
                                'OEE': "-",
                                'Target': "XXX",
                                'Actual': "YYY",
                                'Delinquency': "ZZZ"
                            },
                            {
                                'Value Streams': "Part # XXXX002",
                                'Availability': "-",
                                'Performance': "-",
                                'Quality Rate': "-",
                                'OEE': "-",
                                'Target': "XXX",
                                'Actual': "YYY",
                                'Delinquency': "ZZZ"
                            },
                            {
                                'Value Streams': "Part # XXXX003",
                                'Availability': "-",
                                'Performance': "-",
                                'Quality Rate': "-",
                                'OEE': "-",
                                'Target': "XXX",
                                'Actual': "YYY",
                                'Delinquency': "ZZZ"
                            }
                        ]
                    }]
                }]
            },
            {
                'Value Streams': "Turbine Airfoils",
                'Availability': "XX%",
                'Performance': "XX%",
                'Quality Rate': "XX%",
                'OEE': "XX%",
                'Target': '-',
                'Actual': '-',
                'Delinquency': '-'
            },
            {
                'Value Streams': "Assembly Test & MRO",
                'Availability': "XX%",
                'Performance': "XX%",
                'Quality Rate': "XX%",
                'OEE': "XX%",
                'Target': '-',
                'Actual': '-',
                'Delinquency': '-'
            }
        ];

        // adding header in table once table is rendered in DOM
        $timeout(function() {
            angular.element('.vs-table table thead').prepend('<tr> <th></th>\
           <th colspan="4"> Overall Equipment Effectiveness</th> <th colspan="3"> Throughput</th></tr>');
        }, 100);

        //
        $scope.tableHandler = function(branch) {
            //debugger;   
        }
    }
});