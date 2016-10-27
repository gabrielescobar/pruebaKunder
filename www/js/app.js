// Ionic marvel App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'marvel' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'marvel.services' is found in services.js
// 'marvel.controllers' is found in controllers.js
angular.module('marvel', ['ionic', 'marvel.controllers', 'marvel.services', 'angular-md5','ionic-ajax-interceptor'])

.run(function($ionicPlatform, $rootScope,AjaxInterceptor,md5) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // Credenciales suministradas por la api de marvel
    $rootScope.key_public = "f07c8f0ed4a543bdef9c55ca8f778776";
    $rootScope.key_private = "57ca6306c0ca7fada6d269723b783dfe8a8951d1";

  });

  //cargo el loader cada vez que se haga una http request
  AjaxInterceptor.run();
})

.config(function($stateProvider, $urlRouterProvider,AjaxInterceptorProvider) {

  AjaxInterceptorProvider.config({
    title: "Cargando",
    defaultMessage: "Ha ocurrido un error"
  });
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // Each tab has its own nav history stack:
    .state('comics', {
      url: '/',
      views: {
        'comics': {
          templateUrl: 'templates/comics.html',
          controller: 'ComicsCtrl'
        }
      }
    })
    .state('comics-detail', {
      url: '/comics/:comicId/:name',
      views: {
        'comics': {
          templateUrl: 'templates/detail-comic.html',
          controller: 'ComicDetailCtrl'
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

});
