define(['angular', '../app-module', '../services/oee-supply-chain-service'], function(angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('oeeSummaryCtrl', oeeSummaryCtrl);
    oeeSummaryCtrl.$inject = ['$scope', '$timeout', '$window', 'OeeSupplyChainService'];

    function oeeSummaryCtrl($scope, $timeout, $window, OeeSupplyChainService) {
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
                selectedSiteCode: sessionStorage.getItem("SelectedSiteCode"),
                MachineGroupOptions: ['GENx EDM - OP50','Group_2', 'Group_1', 'Group_4', 'GE90 Grind', 'Group_6', 'Group_3', 'M96 Grind', 'M91 Grind', 'Group_5', 'au-magerle002', 'Group_1'],
                selectedMachineGroup: 'au-magerle002',
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
        $scope.oeeSummary.filter.MachineGroupOptions = $scope.oeeSummary.filter.selectedSiteCode == 'GNV' ? ['GENx EDM - OP50','Group_2', 'Group_1', 'Group_4', 'GE90 Grind', 'Group_6', 'Group_3', 'M96 Grind', 'M91 Grind', 'Group_5'] : $scope.oeeSummary.filter.selectedSiteCode == 'AUB' ? ['au-magerle002'] : $scope.oeeSummary.filter.selectedSiteCode == 'WIL' ? ['Group_1'] : ['GENx EDM - OP50','Group_2', 'Group_1', 'Group_4', 'GE90 Grind', 'Group_6', 'Group_3', 'M96 Grind', 'M91 Grind', 'Group_5', 'au-magerle002', 'Group_1'];
        $scope.oeeSummary.filter.selectedMachineGroup = $scope.oeeSummary.filter.MachineGroupOptions[0];
        $scope.dataforpage;
        $scope.StartWeek=1;
        $scope.EndWeek=52;

        $scope.ChangedStartWeek=function(){            
            document.getElementById("ApplyWeekbtn").disabled = false;
        }

        $scope.ChangedEndWeek=function(){            
            document.getElementById("ApplyWeekbtn").disabled = false;
        }

        //Changing Week
        $scope.applyWeek=function(){
            $scope.plotOEEbyFiscalWeek($scope.dataforpage.fiscalWeekOeeList);
            $scope.plotAvailabilitybyFiscalWeek($scope.dataforpage.fiscalWeekAvailabilityList);
            $scope.plotPerformancebyFiscalWeek($scope.dataforpage.fiscalWeekPerformanceList);
            $scope.plotQualityRatebyFiscalWeek($scope.dataforpage.fiscalWeekQualityRateList);
        }


        //For Dependent dropdowns
        $scope.update = function() {
            document.getElementById("Applybtn").disabled = false;
            $scope.oeeSummary.filter.MachineGroupOptions = $scope.oeeSummary.filter.selectedSiteCode == 'GNV' ? ['GENx EDM - OP50','Group_2', 'Group_1', 'Group_4', 'GE90 Grind', 'Group_6', 'Group_3', 'M96 Grind', 'M91 Grind', 'Group_5'] : $scope.oeeSummary.filter.selectedSiteCode == 'AUB' ? ['au-magerle002'] : $scope.oeeSummary.filter.selectedSiteCode == 'WIL' ? ['Group_1'] : ['GENx EDM - OP50','Group_2', 'Group_1', 'Group_4', 'GE90 Grind', 'Group_6', 'Group_3', 'M96 Grind', 'M91 Grind', 'Group_5', 'au-magerle002', 'Group_1'];
            $scope.oeeSummary.filter.selectedMachineGroup = $scope.oeeSummary.filter.MachineGroupOptions[0];
        }

         //For Dependent dropdowns
        $scope.update1 = function() {
            document.getElementById("Applybtn").disabled = false;
        }

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
        Highcharts.setOptions({
            global: {
                useUTC: false
            },
            chart: {
                style: {
                    fontFamily: 'geInspira',
                    fontWeight: 'bold'

                }
            }
        });

        Highcharts.theme = {
   colors: ['#8e4fc8', '#38CBFF','#5B91FF', '#4A7CDE', '#6C5EBF', '#4AA9DE', '#F89C1C',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee']
  }
        //Function to run on Apply Filter Call
        $scope.applyFilter = function() {
            document.getElementById("Applybtn").disabled = true;
            $scope.getdata();
            $scope.toogleFilter();
        }


        $scope.getdata = function() {
            var childUrl = 'https://overallequipmenteffectiveness-supplychain.run.aws-usw02-pr.ice.predix.io/oee/OeeSiteWiseOeeSummary?siteId=' + $scope.oeeSummary.filter.selectedSiteCode + '&assetGroupId=' + $scope.oeeSummary.filter.selectedMachineGroup;
            OeeSupplyChainService.getSupplyChainServiceData(childUrl)
                .then(function(response) {
                    angular.element(".page-loading").addClass("hidden");
                    angular.element("#ui-view").show();
                    $scope.dataforpage = response;
                    $scope.plotOEEbyFiscalWeek($scope.dataforpage.fiscalWeekOeeList);
                    $scope.plotAvailabilitybyFiscalWeek($scope.dataforpage.fiscalWeekAvailabilityList);
                    $scope.plotPerformancebyFiscalWeek($scope.dataforpage.fiscalWeekPerformanceList);
                    $scope.plotQualityRatebyFiscalWeek($scope.dataforpage.fiscalWeekQualityRateList);
                    oeeSummaryTable();
                }, function(error) {
                    console.log('Failed to fetch data');
                });

        }

        //Plot OEE by Fiscal Week
        $scope.plotOEEbyFiscalWeek = function(val) {
            var datatoplotchart = [];
            angular.forEach(val, function(value, key) {
                if(value.fiscalWeek>=$scope.StartWeek && value.fiscalWeek<=$scope.EndWeek){
                datatoplotchart.push({
                    'x': value.fiscalWeek,
                    'y': value.oeeValue
                })
            }
            })
            $scope.chart1 = new Highcharts.Chart({
                rangeSelector: {
                    selected: 1
                },
                chart: {
                    renderTo: 'container',
                    zoomType: 'x'
                },
                yAxis: {
                    labels: {
                        style: {
                            fontSize: '13px'
                        },
                        formatter: function () {
                    return this.axis.defaultLabelFormatter.call(this) + "%";
                }      
                    },
                    min: 0,
                    title: {
                        text: 'OEE'
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + 'Week : ' + this.x + '<br />OEE : ' + Highcharts.numberFormat(this.y, 2) + "%";
                    }
                },
               plotOptions: {
            series: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }
        },
                xAxis: {
                    labels: {
                        style: {
                            fontSize: '11px'
                        }
                    }
                },

                title: {
                    text: ''
                },
                legend: {
                    itemStyle: {}
                },
                credits: {
                    enabled: false
                },

                series: [{
                    name: 'Weekly Trend',
                    data: datatoplotchart,
                    type: 'line'
                }],

                exporting: {
                    enabled: false
                }
            });

        }

        //Plot Availability by Fiscal Week

        $scope.plotAvailabilitybyFiscalWeek = function(val) {
            var datatoplotchart = [];
            angular.forEach(val, function(value, key) {

                if(value.fiscalWeek>=$scope.StartWeek && value.fiscalWeek<=$scope.EndWeek){
                datatoplotchart.push({
                    'x': value.fiscalWeek,
                    'y': value.availabilty
                })
            }
            })
            $scope.chart1 = new Highcharts.Chart({
                rangeSelector: {
                    selected: 1
                },
                chart: {
                    renderTo: 'container1',
                    zoomType: 'x'
                },
                yAxis: {
                    labels: {
                        style: {
                            fontSize: '13px'
                        },
                             formatter: function () {
                    return this.axis.defaultLabelFormatter.call(this) + "%";
                }  
                    },
                    min: 0,
                    max:100,
                    title: {
                        text: 'Availability'
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + 'Week : ' + this.x + '<br />Availability : ' + Highcharts.numberFormat(this.y, 2) + "%";
                    }
                },
                plotOptions: {
            series: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }
        },
                xAxis: {
                    labels: {
                        style: {
                            fontSize: '11px'
                        }
                    }
                },

                title: {
                    text: ''
                },
                legend: {
                    itemStyle: {}
                },
                credits: {
                    enabled: false
                },

                series: [{
                    name: 'Weekly Trend',
                    data: datatoplotchart,
                    type: 'line'
                }],

                exporting: {
                    enabled: false
                }
            });

        }


        //Plot Performance by Fiscal Week

        $scope.plotPerformancebyFiscalWeek = function(val) {
            var datatoplotchart = [];
            angular.forEach(val, function(value, key) {
                if(value.fiscalWeek>=$scope.StartWeek && value.fiscalWeek<=$scope.EndWeek){
                datatoplotchart.push({
                    'x': value.fiscalWeek,
                    'y': value.performance
                })
            }
            })
            $scope.chart1 = new Highcharts.Chart({
                rangeSelector: {
                    selected: 1
                },
                chart: {
                    renderTo: 'container2',
                    zoomType: 'x'
                },
                yAxis: {
                    labels: {
                        style: {
                            fontSize: '13px'
                        },
                             formatter: function () {
                    return this.axis.defaultLabelFormatter.call(this) + "%";
                }  
                    },
                    min: 0,
                    title: {
                        text: 'Performance'
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + 'Week : ' + this.x + '<br />Performance : ' + Highcharts.numberFormat(this.y, 2) + "%";
                    }
                },
                plotOptions: {
            series: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }
        },
                xAxis: {
                    labels: {
                        style: {
                            fontSize: '11px'
                        }
                    }
                },

                title: {
                    text: ''
                },
                legend: {
                    itemStyle: {}
                },
                credits: {
                    enabled: false
                },

                series: [{
                    name: 'Weekly Trend',
                    data: datatoplotchart,
                    type: 'line'
                }],

                exporting: {
                    enabled: false
                }
            });

        }


        //Plot Quality Rate by Fiscal Week

        $scope.plotQualityRatebyFiscalWeek = function(val) {
            var datatoplotchart = [];
            angular.forEach(val, function(value, key) {
                if(value.fiscalWeek>=$scope.StartWeek && value.fiscalWeek<=$scope.EndWeek){
                datatoplotchart.push({
                    'x': value.fiscalWeek,
                    'y': value.qualityRate
                })
            }
            })
            $scope.chart1 = new Highcharts.Chart({
                rangeSelector: {
                    selected: 1
                },
                chart: {
                    renderTo: 'container3',
                    zoomType: 'x'
                },
                yAxis: {
                    labels: {
                        style: {
                            fontSize: '13px'
                        },
                             formatter: function () {
                    return this.axis.defaultLabelFormatter.call(this) + "%";
                }  
                    },
                    min: 0,
                    max:100,
                    title: {
                        text: 'Quality Rate'
                    }
                },
                tooltip: {
                    formatter: function() {
                        return '<b>' + 'Week : ' + this.x + '<br />Quality Rate : ' + Highcharts.numberFormat(this.y, 2) + "%";
                    }
                },
                plotOptions: {
            series: {
                fillColor: {
                    linearGradient: [0, 0, 0, 300],
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                }
            }
        },
                xAxis: {
                    labels: {
                        style: {
                            fontSize: '11px'
                        }
                    }
                },

                title: {
                    text: ''
                },
                legend: {
                    itemStyle: {}
                },
                credits: {
                    enabled: false
                },

                series: [{
                    name: 'Weekly Trend',
                    data: datatoplotchart,
                    type: 'line'
                }],

                exporting: {
                    enabled: false
                }
            });

        }
        $scope.getdata();

        function oeeSummaryTable () {
            var tempData = $scope.dataforpage.eachPartYearlyData;
            $scope.oeeSummaryTable = [{
                        'week': 'Last Week',
                        'availabilty': (tempData.lastWeeksAvailability),
                        'performance': (tempData.lastWeeksPerformance),
                        'qualityrate': (tempData.lastWeeksQualityRate),
                        'oeePercentage': (tempData.lastWeeksOee)
                    },
                    {
                        'week': 'Last 4 Weeks',
                        'availabilty': (tempData.last4WeeksAvailability),
                        'performance': (tempData.last4WeeksPerformance),
                        'qualityrate': (tempData.last4WeeksQualityRate),
                        'oeePercentage': (tempData.last4WeeksOee)
                    },
                    {
                        'week': 'YTD',
                        'availabilty': (tempData.yearAvailability),
                        'performance': (tempData.yearPerformance),
                        'qualityrate': (tempData.yearQualityRate),
                        'oeePercentage': (tempData.yearOee) 
                    }];  
        }

    }
});