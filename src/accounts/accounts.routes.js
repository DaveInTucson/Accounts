(function ()
{
  'use strict';

  //console.log('in accounts.routes.js');
  angular.module('Accounts')
    .config(routeConfig);

  routeConfig.$inject = ['$urlRouterProvider', '$stateProvider'];
  function routeConfig ($urlRouterProvider, $stateProvider)
  {
    //console.log('in routeConfig');
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('depositBalances', {
        url: '/',
        templateUrl: 'src/accounts/templates/depositbalancesstate.html',
        controller: 'DepositBalancesStateController as $ctrl',
        resolve: {
          depositBalances: ['AccountDBService', function(AccountDBService) {
            return AccountDBService.getDepositBalances();
          }],
        }
      })
      .state('accountTransactions', {
        url: '/accountTransactions?accountID&month',
        templateUrl : 'src/accounts/templates/accounttransactionsstate.html',
        controller : 'AccountTransactionsStateController as $ctrl',
        resolve : {
          transactionDetails : ['$stateParams', 'AccountDBService',
            function($stateParams, AccountDBService) {
              return AccountDBService.getTransactionDetails($stateParams.accountID, $stateParams.month);
            }],
        }
      })
      ;
  };
  //console.log('leaving accounts.routes.js');
})();
