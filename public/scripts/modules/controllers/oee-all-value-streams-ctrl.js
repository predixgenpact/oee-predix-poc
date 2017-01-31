define(['angular', '../app-module'], function (angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeAllValueStreamsCtrl', OeeAllValueStreamsCtrl);
    OeeAllValueStreamsCtrl.$inject = ['$scope', '$timeout', '$window'];

    function OeeAllValueStreamsCtrl ($scope, $timeout, $window){   
        $scope.oeeAllValueStreamsObj = {
            filter: {
                style: {
                    height: '5px',
                    overflow: 'hidden',
                },
                show: false
            },
            filterIcon: {
                style: {
                    top: '50px',
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

        $scope.toogleFilter = function (){
            $scope.oeeAllValueStreamsObj.filter.show = !$scope.oeeAllValueStreamsObj.filter.show;
            $scope.oeeAllValueStreamsObj.table.showThroughputCol = !$scope.oeeAllValueStreamsObj.table.showThroughputCol;
            $scope.oeeAllValueStreamsObj.table.showOeeCol = !$scope.oeeAllValueStreamsObj.table.showOeeCol;

            if( $scope.oeeAllValueStreamsObj.filter.show) {
                $scope.oeeAllValueStreamsObj.filter.style = {
                    height: '55px',
                    overflow: 'hidden'
                };
                $scope.oeeAllValueStreamsObj.filterIcon.style = {
                    top: '100px'
                };
                $timeout(function (){
                    $scope.oeeAllValueStreamsObj.filter.style.overflow = 'inherit';                  
                }, 600);
                $scope.oeeAllValueStreamsObj.filterContent.style.display = 'block';                    
            } else {
                $scope.oeeAllValueStreamsObj.filter.style = {
                    height: '5px',
                    overflow: 'hidden'
                };
                $scope.oeeAllValueStreamsObj.filterIcon.style = {
                    top: '50px'
                };
                $timeout(function (){
                    $scope.oeeAllValueStreamsObj.filterContent.style.display = 'none';                    
                }, 500);
            } 
        }

        // table Json
        $scope.tree_data = [
            {'Value Streams':"USA1", 'Availability': 9826675, 'Performance': 4545, 'Quality Rate': 318212000,'OEE': "UTC -5 to -10", 'Target': '-', 'Actual': '-', 'Delinquency': '-',
            children:[
                {'Value Streams':"USA2", 'Availability': 9826675, 'Performance': 4545, 'Quality Rate': 318212000,'OEE': "UTC -5 to -10", 'Target': '-', 'Actual': '-', 'Delinquency': '-',
                    children: [
                        {'Value Streams':"USA3", 'Availability': 9826675, 'Quality Rate': 318212000,'OEE': "UTC -5 to -10", 'Target': '-', 'Actual': '-', 'Delinquency': '-',
                            children: [
                                {'Value Streams':"USA4", 'Availability': 9826675, 'Performance': 4545, 'Quality Rate': 318212000,'OEE': "UTC -5 to -10", 'Target': '-', 'Actual': '-', 'Delinquency': '-'},
                                {'Value Streams':"USA4", 'Availability': 9826675, 'Performance': 4545, 'Quality Rate': 318212000,'OEE': "UTC -5 to -10", 'Target': '-', 'Actual': '-', 'Delinquency': '-'},
                                {'Value Streams':"USA4", 'Availability': 9826675, 'Performance': 4545, 'Quality Rate': 318212000,'OEE': "UTC -5 to -10", 'Target': '-', 'Actual': '-', 'Delinquency': '-'}
                            ],
                            icons: {
                                iconLeaf: "fa fa-chevron-down",
                                iconCollapse: "fa fa-chevron-up",
                                iconExpand: "fa fa-chevron-down"
                            }
                        }
                    ],
                    icons: {
                        iconLeaf: "fa fa-chevron-down",
                        iconCollapse: "fa fa-chevron-up",
                        iconExpand: "fa fa-chevron-down"
                    }
                }
            ],
            icons: {
                iconLeaf: "-",
                iconCollapse: "fa fa-chevron-up",
                iconExpand: "fa fa-chevron-down"
            }},
            {'Value Streams':"USA000", 'Availability': 9826675, 'Performance': 4545, 'Quality Rate': 318212000,'OEE': "UTC -5 to -10", 'Target': '-', 'Actual': '-', 'Delinquency': '-',
        icons: {
                iconLeaf: '-'
            }}
        ];
            
        // adding header in table
        $timeout(function () {
            angular.element('.vs-table table thead').prepend('<tr> <th></th>\
           <th colspan="4"> Overall Equipment Effectiveness</th> <th colspan="3"> Throughput</th></tr>');
        }, 100);

        $scope.tableHandler = function (branch) {
            debugger;   
        }
        
    }
});