define(['angular', '../app-module', '../services/oee-supply-chain-service'], function(angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeDashboardCtrl', OeeDashboardCtrl);
    OeeDashboardCtrl.$inject = ['$scope', '$timeout', '$window', 'OeeSupplyChainService'];


    function OeeDashboardCtrl($scope, $timeout, $window, OeeSupplyChainService) {

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
                    } else {
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
                } else {
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


        // Apply Filter
          $scope.applyFilter = function() {
              document.getElementById("Applybtn").disabled = true;
              $scope.coordstoplot = $scope.coords;
              if ($scope.temp.length != 0) {
                  $scope.coordstoplotafterfilter = [];
                  angular.forEach($scope.temp, function(value, key) {
                      if (value.checked != false) {
                          angular.forEach($scope.coordstoplot, function(value1, key1) {
                              if (value.val == value1.oee_status) {
                                  $scope.coordstoplotafterfilter.push(value1);
                              }
                          })
                      }
                  })
                  $scope.coordstoplot = $scope.coordstoplotafterfilter;
                  angular.forEach($scope.temp, function(value, key) {
                      if ($scope.temp[0].checked == false) {
                          document.getElementById("Acceptable").style.display = "none";

                      } else {
                          document.getElementById("Acceptable").style.display = "block";
                      }
                      if ($scope.temp[1].checked == false) {
                          document.getElementById("Risk").style.display = "none";
                      } else {
                          document.getElementById("Risk").style.display = "block";
                      }
                      if ($scope.temp[2].checked == false) {
                          document.getElementById("Constrained").style.display = "none";
                      } else {
                          document.getElementById("Constrained").style.display = "block";
                      }

                  })
              }
              if ($scope.temp1.length != 0) {
                  $scope.coordstoplotafterfilter = [];
                  angular.forEach($scope.temp1, function(value, key) {
                      if (value.checked != false) {
                          angular.forEach($scope.coordstoplot, function(value1, key1) {
                              if (value.val == value1.sitecode) {
                                  $scope.coordstoplotafterfilter.push(value1);
                              }
                          })
                      }
                  })
                  $scope.coordstoplot = $scope.coordstoplotafterfilter;
              }
              if ($scope.temp2.length != 0) {
                  $scope.coordstoplotafterfilter = [];
                  angular.forEach($scope.temp2, function(value, key) {
                      if (value.checked != false) {
                          angular.forEach($scope.coordstoplot, function(value1, key1) {
                              if (value.val == value1.country) {
                                  $scope.coordstoplotafterfilter.push(value1);
                              }
                          })
                      }
                  })
                  $scope.coordstoplot = $scope.coordstoplotafterfilter;
              }
              $scope.func($scope.coordstoplotafterfilter);
              $scope.toogleFilter();
          }

        // reset all filter selection
        $scope.resetFilter = function() {
            document.getElementById("Applybtn").disabled = true;
            document.getElementById("Resetbtn").disabled = true;
            document.getElementById("Acceptable").style.display = "block";
            document.getElementById("Risk").style.display = "block";
            document.getElementById("Constrained").style.display = "block";

            if ($scope.temp.length != 0) {
                for (var i = 0; i < $scope.temp.length; i++) {
                    if ($scope.temp[i].checked == false) {
                        $scope.temp[i].checked = true;
                        document.getElementById('test').items[i].checked = true;
                    }
                }
            }
            if ($scope.temp1.length != 0) {
                for (var i = 0; i < $scope.temp1.length; i++) {
                    if ($scope.temp1[i].checked == false) {
                        $scope.temp1[i].checked = true;
                    }
                }
            }
            if ($scope.temp2.length != 0) {
                for (var i = 0; i < $scope.temp2.length; i++) {
                    if ($scope.temp2[i].checked == false) {
                        $scope.temp2[i].checked = true;
                    }
                }
            }
            $scope.func($scope.coords);
            $scope.toogleFilter();
        }


        //Event Listener for Px-Dropdown
           document.addEventListener('px-dropdown-click', function(evt) {

               //Making the buttons Able
               document.getElementById("Applybtn").disabled = false;
               document.getElementById("Resetbtn").disabled = false;
               $("#Applybtn").addClass("mdl-button--colored");
               $("#Resetbtn").addClass("mdl-button--colored");

               //On Selection of Status
               $("#test").click(function(event) {
                   window.setTimeout(function() {
                       $scope.temp = document.getElementById('test').items;
                   }, 1000);
               });

               //On Selection of Site Code
               $("#test1").click(function(event) {
                   window.setTimeout(function() {
                       $scope.temp1 = document.getElementById('test1').items;
                   })
               });

               //On Selection of Country
               $("#test2").click(function(event) {
                   window.setTimeout(function() {
                       $scope.temp2 = document.getElementById('test2').items;
                   })
               });

           });


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

                var markerCluster = new MarkerClusterer(map, markers, /*mcOptions*/ {
                    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
                });
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