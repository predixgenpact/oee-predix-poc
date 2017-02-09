define(['angular', '../app-module', '../services/oee-supply-chain-service'], function(angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeDashboardCtrl', OeeDashboardCtrl);
    OeeDashboardCtrl.$inject = ['$scope', '$timeout', '$window', 'OeeSupplyChainService','$http'];


    function OeeDashboardCtrl($scope, $timeout, $window, OeeSupplyChainService,$http) {
        angular.element(".page-loading").addClass("hidden");

        $scope.oeeDashboardObj = {
            filter: {
                show: false,
                style: {
                    height: '5px',
                    overflow: 'hidden'
                }
            },
            /*filterContent: {
                style: {
                    margin: '15px 240px',
                    height: '35px',
                    display: 'none'
                }
            },*/
            filterIcon: {
                style: {
                    top: '50px'
                }
            },
            infoCard: {
                show: true
            },
            googleMaps: {
                style: {
                    width: '100%',
                    height: '480px'
                }
            },
            disableResetFilterBtn: true,
            selectedCountries: []
        }


        //Enable and Disable Apply and Reset Button
        $(document).on("click", "#Option", function(){
            document.getElementById("Applybtn").disabled = false;
            document.getElementById("Resetbtn").disabled = false;
        }); 

        $scope.temp = [];
        $scope.temp1 = [];
        $scope.temp2 = [];
        $scope.coords = [];
        $scope.coordstoplot = [];
        $scope.coordstoplotafterfilter = [];
        $scope.width = window.innerWidth;
        $scope.height = window.innerHeight;
        var markers = [];
        var marker;
            $(window).resize(function() {
                $scope.width = window.innerWidth;
                if ($scope.oeeDashboardObj.filter.show) {

                    if ($scope.width < 650) {
                        $scope.oeeDashboardObj.filter.style = {
                            height: '170px',
                            overflow: 'hidden'
                        };
                        $scope.oeeDashboardObj.filterIcon.style = {
                            top: '210px'
                        };
                    } else if($scope.width > 650 && $scope.width < 800) {
                        $scope.oeeDashboardObj.filter.style = {
                            height: '100px',
                            overflow: 'hidden'
                        };
                        $scope.oeeDashboardObj.filterIcon.style = {
                            top: '145px'
                        };
                    }
                     else {
                        $scope.oeeDashboardObj.filter.style = {
                            height: '65px',
                            overflow: 'hidden'
                        };
                        $scope.oeeDashboardObj.filterIcon.style = {
                            top: '110px'
                        };
                    }
                    $timeout(function() {
                        $scope.oeeDashboardObj.filter.style.overflow = 'inherit';
                    }, 600);
                    document.getElementById('filterContent').style.display = 'block';
                } else {
                    $scope.oeeDashboardObj.filter.style = {
                        height: '5px',
                        overflow: 'hidden'
                    };
                    $scope.oeeDashboardObj.filterIcon.style = {
                        top: '50px'
                    };
                    $timeout(function() {
                        document.getElementById('filterContent').style.display = 'none';
                    }, 500);
                }
            });

        // show/hide filter
        $scope.toogleFilter = function() {
            $scope.oeeDashboardObj.filter.show = !$scope.oeeDashboardObj.filter.show;
            if ($scope.oeeDashboardObj.filter.show) {

                if ($scope.width < 650) {
                    $scope.oeeDashboardObj.filter.style = {
                        height: '170px',
                        overflow: 'hidden'
                    };
                    $scope.oeeDashboardObj.filterIcon.style = {
                        top: '210px'
                    };
                } else if($scope.width > 650 && $scope.width < 800) {
                        $scope.oeeDashboardObj.filter.style = {
                            height: '100px',
                            overflow: 'hidden'
                        };
                        $scope.oeeDashboardObj.filterIcon.style = {
                            top: '145px'
                        };
                    }
                    else {
                    $scope.oeeDashboardObj.filter.style = {
                        height: '65px',
                        overflow: 'hidden'
                    };
                    $scope.oeeDashboardObj.filterIcon.style = {
                        top: '110px'
                    };
                }
                $timeout(function() {
                    $scope.oeeDashboardObj.filter.style.overflow = 'inherit';
                }, 600);
                document.getElementById('filterContent').style.display = 'block';
            } else {
                $scope.oeeDashboardObj.filter.style = {
                    height: '5px',
                    overflow: 'hidden'
                };
                $scope.oeeDashboardObj.filterIcon.style = {
                    top: '50px'
                };
                $timeout(function() {
                    document.getElementById('filterContent').style.display = 'none';
                }, 500);
            }
        }

        // hide map info card
        $scope.closeInfoCard = function() {
            $scope.oeeDashboardObj.infoCard.show = false;
        }

        //var childUrl = '../json/supply-chain.json';
        var childUrl = 'https://overallequipmenteffectiveness-supplychain.run.aws-usw02-pr.ice.predix.io/oee/SiteGeographyDetails';
        OeeSupplyChainService.getSupplyChainServiceData(childUrl)
            .then(function(response) {
                $scope.coords = response;
                $scope.coordstoplot = response;
                $scope.func($scope.coords);
            }, function(error) {
                console.log('Failed to fetch data');
            });

            //Filters
            $scope.searchSelectAllModel = []; 
            $scope.searchSelectAllData = [ 
              {id: "AcceptableOEE",label:"AcceptableOEE"},
              {id: "AtRisk",label:"AtRisk"},
              {id: "Constrained",label:"Constrained"}
            ];
            $scope.searchSelectAllSettings = {
              enableSearch: true,
              showSelectAll: true,
              keyboardControls: true
            };
            $scope.example5customTexts = {buttonDefaultText: 'Select Status'};
            $scope.example6model=[ 
              {id: "AcceptableOEE",label:"AcceptableOEE"},
              {id: "AtRisk",label:"AtRisk"},
              {id: "Constrained",label:"Constrained"}
            ];

            //Second Filter
            $scope.searchSelectAllModel1 = []; 
            $scope.searchSelectAllData1 = [ 
              {id: "Australia", label: "Australia"},
              {id: "Brazil", label: "Brazil"},
              {id: "Canada", label: "Canada"},
              {id: "China", label: "China"},
              {id: "CzechRepublic", label: "CzechRepublic"},
              {id: "France", label: "France"},
              {id: "Germany", label: "Germany"},
              {id: "Hungary", label: "Hungary"},
              {id: "Italy", label: "Italy"},
              {id: "Korea", label: "Korea"},
              {id: "Malaysia", label: "Malaysia"},
              {id: "Mexico", label: "Mexico"},
              {id: "Poland", label: "Poland"},
              {id: "Qatar", label: "Qatar"},
              {id: "Romania", label: "Romania"},
              {id: "Singapore", label: "Singapore"},
              {id: "Turkey", label: "Turkey"},
              {id: "United Arab Emirates", label: "UAE"},
              {id: "United Kingdom", label: "UK"},
              {id: "United States", label: "USA"}
            ];
            $scope.searchSelectAllSettings1 = {
              enableSearch: true,
              showSelectAll: true,
              keyboardControls: true
            };
            $scope.example5customTexts1 = {buttonDefaultText: 'Select Country'};
            $scope.example6model1=[ 
              {id: "Australia", label: "Australia"},
              {id: "Brazil", label: "Brazil"},
              {id: "Canada", label: "Canada"},
              {id: "China", label: "China"},
              {id: "CzechRepublic", label: "CzechRepublic"},
              {id: "France", label: "France"},
              {id: "Germany", label: "Germany"},
              {id: "Hungary", label: "Hungary"},
              {id: "Italy", label: "Italy"},
              {id: "Korea", label: "Korea"},
              {id: "Malaysia", label: "Malaysia"},
              {id: "Mexico", label: "Mexico"},
              {id: "Poland", label: "Poland"},
              {id: "Qatar", label: "Qatar"},
              {id: "Romania", label: "Romania"},
              {id: "Singapore", label: "Singapore"},
              {id: "Turkey", label: "Turkey"},
              {id: "United Arab Emirates", label: "UAE"},
              {id: "United Kingdom", label: "UK"},
              {id: "United States", label: "USA"}
            ];

            //Third Filter
            $scope.searchSelectAllModel2 = []; 
            $scope.searchSelectAllData2 = [ 
              {id: "Rotating", label: "Rotating"},
              {id: "Turbine", label: "Turbine"}
            ];
            $scope.searchSelectAllSettings2 = {
              enableSearch: true,
              showSelectAll: true,
              keyboardControls: true
            };
            $scope.example5customTexts2 = {buttonDefaultText: 'Select Value Stream'};
            $scope.example6model3=[ 
              {id: "Rotating", label: "Rotating"},
              {id: "Turbine", label: "Turbine"}
            ];

        // Apply Filter
          $scope.applyFilter = function() {

            $scope.statusinbody="";
            $scope.countryinbody="";
            $scope.valueStreamsinbody="";

            document.getElementById("AcceptableOEE").style.display = "block";
            document.getElementById("AtRisk").style.display = "block";
            document.getElementById("Constrained").style.display = "block";
            document.getElementById("Applybtn").disabled = true;

            var hasAcceptable=true;
            var hasAtRisk=true;
            var hasConstrained=true;


            //Dynamic Legend for Map
            for (var index = 0; index < $scope.example6model.length; ++index) {
              var statusinarray = $scope.example6model[index];
              if(statusinarray.id == "AcceptableOEE"){
               hasAcceptable = true;
               break;
              }
              else{
                hasAcceptable = false;
              }
              }

              for (var index = 0; index < $scope.example6model.length; ++index) {
              var statusinarray = $scope.example6model[index];
              if(statusinarray.id == "AtRisk"){
               hasAtRisk = true;
               break;
              }
              else{
                hasAtRisk = false;
              }
              }
              for (var index = 0; index < $scope.example6model.length; ++index) {
              var statusinarray = $scope.example6model[index];
              if(statusinarray.id == "Constrained"){
               hasConstrained = true;
               break;
              }
              else{
                hasConstrained = false;
              }
              }

              if(hasAcceptable!=true){
                document.getElementById("AcceptableOEE").style.display="none";
              }

              if(hasAtRisk!=true){
                document.getElementById("AtRisk").style.display="none";
              }

              if(hasConstrained!=true){
                document.getElementById("Constrained").style.display="none";
              }


              //Fetching the Filtered Data            
              function joinObj(a, attr) {
              var out = []; 
              for (var i=0; i<a.length; i++) {  
              out.push(a[i][attr]); 
              } 
              return out.join(",");
              }

            $scope.statusinbody=joinObj($scope.example6model,'id');;  
            $scope.countryinbody=joinObj($scope.example6model1,'id');
            $scope.valueStreamsinbody=joinObj($scope.example6model3,'id');
                  var body = {
                  "status" :$scope.statusinbody,

                  "country" : $scope.countryinbody,

                  "valueStreams" :$scope.valueStreamsinbody
                  };

                  $http.post("https://overallequipmenteffectiveness-supplychain.run.aws-usw02-pr.ice.predix.io/oee/SiteGeographyDetailsByFilters", body, {
                  headers: {
                  "Content-Type": "application/json"
                  },
                  transformResponse : function(data){
                  return data;
                  }
                  })
                  .success(function(data, status, headers, config) {
                  $scope.coordstoplotafterfilter=JSON.parse(data);
                    $scope.func($scope.coordstoplotafterfilter);
                  })
            
              $scope.toogleFilter();
          }

        // reset all filter selection
        $scope.resetFilter = function() {
            document.getElementById("Resetbtn").disabled = true;
            document.getElementById("Applybtn").disabled = true;
            document.getElementById("AcceptableOEE").style.display = "block";
            document.getElementById("AtRisk").style.display = "block";
            document.getElementById("Constrained").style.display = "block";
             $scope.example6model3=[ 
              {id: "Rotating", label: "Rotating"},
              {id: "Turbine", label: "Turbine"}
            ];

             $scope.example6model1=[ 
              {id: "Australia", label: "Australia"},
              {id: "Brazil", label: "Brazil"},
              {id: "Canada", label: "Canada"},
              {id: "China", label: "China"},
              {id: "CzechRepublic", label: "CzechRepublic"},
              {id: "France", label: "France"},
              {id: "Germany", label: "Germany"},
              {id: "Hungary", label: "Hungary"},
              {id: "Italy", label: "Italy"},
              {id: "Korea", label: "Korea"},
              {id: "Malaysia", label: "Malaysia"},
              {id: "Mexico", label: "Mexico"},
              {id: "Poland", label: "Poland"},
              {id: "Qatar", label: "Qatar"},
              {id: "Romania", label: "Romania"},
              {id: "Singapore", label: "Singapore"},
              {id: "Turkey", label: "Turkey"},
              {id: "United Arab Emirates", label: "UAE"},
              {id: "United Kingdom", label: "UK"},
              {id: "United States", label: "USA"}
            ];

            $scope.example6model=[ 
              {id: "AcceptableOEE",label:"AcceptableOEE"},
              {id: "AtRisk",label:"AtRisk"},
              {id: "Constrained",label:"Constrained"}
            ];
            $scope.func($scope.coords);
            $scope.toogleFilter();
        }

        //Plotting the Map
        $scope.func = function(val) {
            // Save Markers by location
            var placeMarkerList = {};
            var markerBounds = new google.maps.LatLngBounds();
            var icons = {
                AcceptableOEE: {
                    icon: '../images/location-green.png'
                },
                AtRisk: {
                    icon: '../images/AtRisk.png'
                },
                Constrained: {
                    icon: '../images/Constrained.png'
                }
            };

            //Different Behaviour of Map Zoom and Center Placing as per the Screen Size
            if ($scope.height < 500) {
                var map = new google.maps.Map(document.getElementById("googleMap"), {
                    zoom: 1,
                    center: new google.maps.LatLng(19.880392, -31.464844),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            } else if ($scope.width < 800) {
                var map = new google.maps.Map(document.getElementById("googleMap"), {
                    zoom: 2,
                    center: new google.maps.LatLng(19.880392, -31.464844),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            } else {
                var map = new google.maps.Map(document.getElementById("googleMap"), {
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
            }

            $scope.plotmap = function(data, timeout) {
                window.setTimeout(function() {
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(data.latitude, data.longitude),
                        map: map,
                        title: "Site Code: " + data.sitecode + "/" + "Site Number: " + data.siteno + "/" + "OEE Percent: " + data.oee_percentage,
                        icon: icons[data.oee_status].icon,
                        animation: google.maps.Animation.DROP,
                        SiteNo: data.siteno,
                        SiteCode: data.sitecode,
                        OEEPercentage : data.oee_percentage
                    });
                    markers.push(marker);
                    if ($scope.width > 800) {
                        markerBounds.extend(marker.position);
                        map.fitBounds(markerBounds);
                    }
                    //Click Event Listener
                    google.maps.event.addListener(marker, 'click', function() {
                        if (this.getAnimation() !== null) {
                            this.setAnimation(null);
                        } else {
                            sessionStorage.setItem("SelectedSiteCode", this.SiteCode);
                            this.setAnimation(google.maps.Animation.BOUNCE);
                            window.location.href = "/oeeSummary";
                        }
                    });
                }, timeout);
            }
            for (var i = 0; i < val.length; i++) {
                $scope.plotmap(val[i], i * 100);
            }

            window.setTimeout(function() {
                //To Set the bounds dynamically
                if ($scope.width > 800) {
                    markerBounds.extend(marker.position);
                    map.fitBounds(markerBounds);
                }
                //Cluster for Markers
                var clusterStyles = [{
                        url: '../images/fan-green.png',
                        height: 50,
                        width: 50
                    },
                    {
                        url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png',
                        height: 50,
                        width: 50
                    },
                    {
                        url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png',
                        height: 50,
                        width: 50
                    }
                ];
                var mcOptions = {
                    gridSize: 50,
                    styles: clusterStyles,
                    maxZoom: 15
                };

                /*var markerCluster = new MarkerClusterer(map, markers,  {
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                });*/
            }, 8000);
        }

        // setting map height
        $scope.oeeDashboardObj.googleMaps.style.height = $window.innerHeight - 45 - 40 + 'px';

        angular.element($window).bind('resize', function() {
            $scope.oeeDashboardObj.googleMaps.style.height = $window.innerHeight - 45 - 40 + 'px';
            $scope.$apply();
        });

    }
});