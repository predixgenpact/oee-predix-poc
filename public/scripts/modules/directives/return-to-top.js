define(['angular', 'app-module'], function(angular) {
    'use strict';

    angular.module('app.module')
        .directive('returnToTop', returnToTop);

    returnToTop.$inject = ['$window'];

    function returnToTop ($window){
        return {
            restrict: 'AE',
            template: '<a href="javascript:" id="return-to-top"><i class="icon-chevron-up"></i></a>',
            link: function(scope, element, attrs) {
                
               angular.element(window).scroll(function() {
                    if (angular.element(this).scrollTop() >= 150) {        // If page is scrolled more than 150px
                        angular.element('#return-to-top').fadeIn(200);    // Fade in the arrow
                    } else {
                        angular.element('#return-to-top').fadeOut(200);   // Else fade out the arrow
                    }
                });
                angular.element('#return-to-top').click(function() {      // When arrow is clicked
                    angular.element('body,html').animate({
                        scrollTop : 0                       // Scroll to top of body
                    }, 500);
                });
                            }
        }
    }
});