define(['angular', '../app-module', '../services/oee-supply-chain-service'], function(angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeSummaryCtrl', OeeSummaryCtrl);
    OeeSummaryCtrl.$inject = ['$scope', '$timeout', '$window','OeeSupplyChainService'];

    function OeeSummaryCtrl($scope, $timeout, $window,OeeSupplyChainService) {
       angular.element("#ui-view").hide();
        $scope.oeeSummary = {
            filter: {
                style: {
                    height: '5px',
                    overflow: 'hidden',
                },
                applyButton: true,
                resetButton: true,
                show: false,
                SiteCodeOptions: ['GNV', 'AUB', 'WIL'],
                selectedSiteCode: sessionStorage.getItem("SelectedSiteCode") ? sessionStorage.getItem("SelectedSiteCode") : 'GNV',
                MachineGroupOptions: ['Group_2','Group_1','Group_4','GE90 Grind','Group_6','GENxEDM-OP50','Group_3','M96 Grind','M91 Grind','Group_5','au-magerle002','Group_1'],     
                selectedMachineGroup:'au-magerle002',
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
        $scope.oeeSummary.filter.MachineGroupOptions= $scope.oeeSummary.filter.selectedSiteCode=='GNV' ? ['Group_2','Group_1','Group_4','GE90 Grind','Group_6','GENxEDM-OP50','Group_3','M96 Grind','M91 Grind','Group_5'] : $scope.oeeSummary.filter.selectedSiteCode=='AUB' ? ['au-magerle002'] : $scope.oeeSummary.filter.selectedSiteCode=='WIL' ? ['Group_1'] : ['Group_2','Group_1','Group_4','GE90 Grind','Group_6','GENxEDM-OP50','Group_3','M96 Grind','M91 Grind','Group_5','au-magerle002','Group_1'];
        $scope.oeeSummary.filter.selectedMachineGroup=$scope.oeeSummary.filter.MachineGroupOptions[0];
        $scope.dataforpage;

        // show/hide filter
        $scope.toogleFilter = function() {            
            $scope.oeeSummary.filter.show = !$scope.oeeSummary.filter.show;
            $scope.oeeSummary.table.showThroughputCol = !$scope.oeeSummary.table.showThroughputCol;
            $scope.oeeSummary.table.showOeeCol = !$scope.oeeSummary.table.showOeeCol;
            if ($scope.oeeSummary.filter.show) {
                $scope.oeeSummary.filter.style = {
                    height: '55px',
                    overflow: 'hidden'
                };
                $scope.oeeSummary.filterIcon.style = {
                    top: '100px',
                    left: '50px',
                    right: '50px',
                    width: '80%'
                };
                $timeout(function() {
                    $scope.oeeSummary.filter.style.overflow = 'inherit';
                }, 600);
            } else {
                $scope.oeeSummary.filter.style = {
                    height: '5px',
                    overflow: 'hidden'
                };
                $scope.oeeSummary.filterIcon.style = {
                   top: '50px',
                    left: '50px',
                    right: '50px',
                    width: '80%'
                };
            }
        }


        $(document).ready(function(){
            $('.collapsible').collapsible();
        });

        $scope.applyFilter = function() {
        document.getElementById("Applybtn").disabled = true;          
        console.log($scope.oeeSummary.filter.selectedSiteCode);
        console.log($scope.oeeSummary.filter.selectedMachineGroup);
        $scope.getdata();
        $scope.toogleFilter();
        }


        var childUrl = 'https://overallequipmenteffectiveness-supplychain.run.aws-usw02-pr.ice.predix.io/oee/OeeSiteWiseOeeSummary?siteId='+$scope.oeeSummary.filter.selectedSiteCode+'&assetGroupId='+$scope.oeeSummary.filter.selectedMachineGroup;
        OeeSupplyChainService.getSupplyChainServiceData(childUrl)
            .then( function (response) {
                // hide spinner
                angular.element(".page-loading").addClass("hidden");
                angular.element("#ui-view").show();

                $scope.dataforpage = response;
                console.log($scope.dataforpage);
                oeeSummaryTable();
                $scope.plotOEEbyFiscalWeek($scope.dataforpage.fiscalWeekOeeList);
            }, function (error) {
                console.log('Failed to fetch data');
            });


        function oeeSummaryTable () {
            var tempData = $scope.dataforpage.eachPartYearlyData;
            $scope.oeeSummaryTable = [{
                        'week': 'Last Week',
                        'availabilty': (tempData.lastWeeksAvailability * 100),
                        'performance': (tempData.lastWeeksPerformance * 100),
                        'qualityrate': (tempData.lastWeeksQualityRate * 100),
                        'oeePercentage': (tempData.lastWeeksOee * 100)
                    },
                    {
                        'week': 'Last 4 Weeks',
                        'availabilty': (tempData.last4WeeksAvailability * 100),
                        'performance': (tempData.last4WeeksPerformance * 100),
                        'qualityrate': (tempData.last4WeeksQualityRate * 100),
                        'oeePercentage': (tempData.last4WeeksOee * 100)
                    },
                    {
                        'week': 'YTD',
                        'availabilty': (tempData.yearAvailability * 100),
                        'performance': (tempData.yearPerformance * 100),
                        'qualityrate': (tempData.yearQualityRate * 100),
                        'oeePercentage': (tempData.yearOee * 100) 
                    }];  
        }

        $scope.plotOEEbyFiscalWeek=function(val){
        }
    }
});