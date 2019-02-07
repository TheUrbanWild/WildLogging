// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  //'ionic',
//  'ngRoute',
		'ui.router',
  	'ngAnimate',
  //	'mgcrea.ngStrap',
  	'ui.bootstrap',
//  	'ng-datalist',
  'ui-notification',
  'app.homeState',
  'app.adminState',
  'app.searchState',
  'app.aboutState',
  'app.locations',
  'app.api',
  'app.auth',
  'toaster'
])
  .config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      "https://www.itis.gov/**"
    ]);
  })
  .run(function($state, $rootScope, Notification, authenticationService) {

    authenticationService.initialise();

    $rootScope.isAuthenticated = authenticationService.isAuthenticated();
    console.log("app.js:run - isAuthenticated = ",$rootScope.isAuthenticated);

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      event.preventDefault();

      $state.get('about').error = { code: 123, description: 'Exception stack trace' }
      return $state.go('about');
    });
    //console.log("going to state:home");
    //$state.transitionTo("home");
  });

