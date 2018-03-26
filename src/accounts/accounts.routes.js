(function ()
{
  'use strict';

  console.log('in accounts.routes.js');
  angular.module('Accounts')
    .config(routeConfig);

  routeConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
  function routeConfig ($urlRouterProvider, $stateProvider)
  {
    console.log('in routeConfig');
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('accounts', {
        abstract: true,
        templateUrl: 'src/accounts/templates/accounts.template.html',
      })
      .state('accounts.front', {
        url: '/',
        templateUrl: 'src/accounts/templates/accounts.front.html',
      })
  };
  console.log('leaving accounts.routes.js');
})();
