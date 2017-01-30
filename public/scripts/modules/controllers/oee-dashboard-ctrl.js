define(['angular',  '../app-module', '../services/oee-supply-chain-service'], function (angular) {
    'use strict';

    // Controller definition
    angular.module('app.module')
        .controller('OeeDashboardCtrl', OeeDashboardCtrl);
    OeeDashboardCtrl.$inject = ['$scope', '$timeout', '$window', 'OeeSupplyChainService'];

    function OeeDashboardCtrl ($scope, $timeout, $window, OeeSupplyChainService){   
       
        $scope.oeeDashboardObj = {
            filter: {
                show: false,
                style: {
                    height:'5px',
                    overflow: 'hidden'
                }
            },
            filterContent: {
                style: {
                    margin: '15px 240px',
                    height: '35px',
                    display: 'none'
                }
            },
            filterIcon: {
                style: {
                    top:'50px'
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
            selectedCountries: [],
            countriesList: [{"key":"1","val":"iPhone"},{"key":"2","val":"Android"},{"key":"3","val":"Blackberry"},{"key":"4","val":"Windows Phone"},{"key":"5","val":"Flip Phone","disabled":true}]
        }
      

        $scope.temp=[];
        $scope.temp1=[];
        $scope.temp2=[];
        $scope.coords=[];
        $scope.coordstoplot=[];
        $scope.coordstoplotafterfilter=[];

        // show/hide filter
        $scope.toogleFilter = function (){
            $scope.oeeDashboardObj.filter.show = !$scope.oeeDashboardObj.filter.show;
            if( $scope.oeeDashboardObj.filter.show) {
                $scope.oeeDashboardObj.filter.style = {
                    height: '65px',
                    overflow: 'hidden'
                };
                $scope.oeeDashboardObj.filterIcon.style = {
                    top: '110px'
                };
                $timeout(function (){
                    $scope.oeeDashboardObj.filter.style.overflow = 'inherit';                  
                }, 600);
                $scope.oeeDashboardObj.filterContent.style.display = 'block';                    
            } else {
                $scope.oeeDashboardObj.filter.style = {
                    height: '5px',
                    overflow: 'hidden'
                };
                $scope.oeeDashboardObj.filterIcon.style = {
                    top: '50px'
                };
                $timeout(function (){
                    $scope.oeeDashboardObj.filterContent.style.display = 'none';                    
                }, 500);
            } 
        }

        // hide map info card
        $scope.closeInfoCard = function () {
             $scope.oeeDashboardObj.infoCard.show = false;
        }

        var childUrl = '../json/supply-chain.json';
        OeeSupplyChainService.getSupplyChainServiceData(childUrl)
        .then(function (response) {
            $scope.coords = response;  
            $scope.coordstoplot=response; 
        }, function (error) {
            console.log('Failed to fetch data');
        });


        // Json call
        $scope.applyFilter = function () {
            document.getElementById("Applybtn").disabled = true;
              $scope.coordstoplot=$scope.coords;
            if($scope.temp.length!=0){
                $scope.coordstoplotafterfilter=[];
                angular.forEach($scope.temp,function(value,key){
                if(value.checked != false){
                angular.forEach($scope.coordstoplot,function(value1,key1){
                if(value.val==value1.Status){
                    $scope.coordstoplotafterfilter.push(value1);
                }
                })
                }
                })
                $scope.coordstoplot=$scope.coordstoplotafterfilter;
                angular.forEach($scope.temp,function(value,key){
                    if($scope.temp[0].checked==false){
                        document.getElementById("Acceptable").style.display = "none";

                    }
                    else{
                        document.getElementById("Acceptable").style.display = "block";   
                    }
                    if($scope.temp[1].checked==false){
                        document.getElementById("Risk").style.display = "none";
                    }
                    else{
                        document.getElementById("Risk").style.display = "block";   
                    }
                    if($scope.temp[2].checked==false){
                        document.getElementById("Constrained").style.display = "none";
                    }
                    else{
                        document.getElementById("Constrained").style.display = "block";   
                    }

                })
            }
            if($scope.temp1.length!=0){
                $scope.coordstoplotafterfilter=[];
                    angular.forEach($scope.temp1,function(value,key){
                if(value.checked != false){
                angular.forEach($scope.coordstoplot,function(value1,key1){
                if(value.val==value1.SiteCode){
                    $scope.coordstoplotafterfilter.push(value1);
                }
                })
                }
                })
                $scope.coordstoplot=$scope.coordstoplotafterfilter;   
            }
                if($scope.temp2.length!=0){
                $scope.coordstoplotafterfilter=[];
                    angular.forEach($scope.temp2,function(value,key){
                if(value.checked != false){
                angular.forEach($scope.coordstoplot,function(value1,key1){
                if(value.val==value1.Country){
                    $scope.coordstoplotafterfilter.push(value1);
                }
                })
                }
                })
                $scope.coordstoplot=$scope.coordstoplotafterfilter;
            }
            $scope.func($scope.coordstoplotafterfilter);
            $scope.toogleFilter();
        }

        // reset all filter selection
        $scope.resetFilter = function () {  
            document.getElementById("Applybtn").disabled = true;
        document.getElementById("Resetbtn").disabled = true;
        document.getElementById("Acceptable").style.display = "block";  
        document.getElementById("Risk").style.display = "block";  
        document.getElementById("Constrained").style.display = "block";        

            if($scope.temp.length!=0){
            for(var i=0;i<$scope.temp.length;i++){
                if($scope.temp[i].checked==false){
                $scope.temp[i].checked=true;
                document.getElementById('test').items[i].checked=true;
                }
            }
            }
            if($scope.temp1.length!=0){
            for(var i=0;i<$scope.temp1.length;i++){
                if($scope.temp1[i].checked==false){
                $scope.temp1[i].checked=true;
                }
            }
            }
            if($scope.temp2.length!=0){
            for(var i=0;i<$scope.temp2.length;i++){
                if($scope.temp2[i].checked==false){
                $scope.temp2[i].checked=true;
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
            window.setTimeout(function(){
            $scope.temp=document.getElementById('test').items;
            },1000);
            });

            //On Selection of Site Code
            $("#test1").click(function(event) {
            window.setTimeout(function(){
            $scope.temp1=document.getElementById('test1').items;
            })
            });

            //On Selection of Country
            $("#test2").click(function(event) {
            window.setTimeout(function(){
            $scope.temp2=document.getElementById('test2').items;
            })
            });

        });


        //Plotting the Map
        $scope.func=function(val){
            var markerBounds = new google.maps.LatLngBounds();
            var icons = {
                Acceptable: {
                icon: '../images/AcceptableOEE.png'
                },
                Risk: {
                icon: '../images/AtRisk.png'
                },
                Constrained:{
                icon: '../images/Constrained.png'  
                }
            };

            var map = new google.maps.Map(document.getElementById("googleMap"),
            {        
            mapTypeId: google.maps.MapTypeId.ROADMAP
            });

        function createMarker(locationArray,timeout) {
                var locations = locationArray.location;
                var title = locationArray.title;
                window.setTimeout(function() {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(locationArray.LAT,locationArray.LONG),
                    map: map,
                    title:  "Site Code: " + locationArray.SiteCode + "/" + "Site Number: " + locationArray.SiteNo,
                    icon:icons[locationArray.Status].icon,
                    animation: google.maps.Animation.DROP,
                    SiteNo:locationArray.SiteNo,
                    SiteCode:locationArray.SiteCode
                });
                //Click Event Listener
                google.maps.event.addListener(marker, 'click', function() {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                    //Saving clicked Site Info
                    sessionStorage.setItem("SelectedSiteCode",marker.SiteCode);
                    sessionStorage.setItem("SelectedSiteNo",marker.SiteNo);
                        /*$scope.locomotiveID=sessionStorage.getItem("SelectedLoco");*/
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    /*window.location.href = "/valueStreams";*/
                    }
                });
                //To Set the bounds dynamically
                    markerBounds.extend(marker.position);
                    map.fitBounds(markerBounds);
            },timeout); 
            }
            for (var i = 0; i < val.length; i++) {
                createMarker(val[i], i*100);
            }   

        }
        setTimeout(function(){ $scope.func($scope.coords); }, 1000);


          // setting map height
        $scope.oeeDashboardObj.googleMaps.style.height = $window.innerHeight-45-40+'px';

        angular.element($window).bind('resize', function(){
           $scope.oeeDashboardObj.googleMaps.style.height = $window.innerHeight-45-40+'px';
           $scope.$apply();
        });

    }
});