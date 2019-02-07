(function () {
  'use strict';

  angular.module('app.auth', ['app.auth.notify'])
    .factory('authenticationService', authenticationService);

  authenticationService.$inject = [
    '$log',
    'authenticationNotifyService'
  ];

  function authenticationService(
    $log,
    authenticationNotifyService
  ) {
 
    var delegate = null;
    var self = this;

    // remember this has got to come in here somewhere: __useTenantInfo: true,

    function setSession (authResult) {
      $log.log('AUTH RESULT', authResult);
      var expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
      localStorage.setItem('accessToken', authResult.idToken);
      localStorage.setItem('expiresAt', expiresAt);
    };


    self.handleAuthentication = function() {
      delegate.parseHash(
        function (err, authResult) {
          if (authResult && authResult.accessToken && authResult.idToken) {
            setSession(authResult);
            authenticationNotifyService.publish('auth0');
            console.log(authResult.idToken);
          } else if (err) {
            alert("There was an error in authentication: please check the console for details." +
              "\n Description: \n " + err.error);
          }
        }
      );
    }



    self.isAuthenticated = function () {
      var expiresAt = JSON.parse(localStorage.getItem('expiresAt'));
      return new Date().getTime() < expiresAt;
    };

    self.login = function () {
      delegate.authorize();
    };

    self.logout = function () {
      localStorage.setItem('expiresAt', 0);
      localStorage.setItem('accessToken', 'na');
    };

    self.initialise = function() {
      if (delegate == null) {
        delegate = new auth0.WebAuth(
          {
            domain: window.auth_config.AUTH0_DOMAIN,
            clientID: window.auth_config.AUTH0_CLIENT_ID,
            audience: window.auth_config.AUTH0_AUDIENCE,
            scope: window.auth_config.AUTH0_REQUESTED_SCOPES,
            responseType: window.auth_config.AUTH0_RESPONSE_TYPE,
            redirectUri: window.auth_config.AUTH0_REDIRECT_URI
          }
        );
       
      }
    };
    return self;
  }
})();
