(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountCacheService', AccountCacheService);

  AccountCacheService.$inject = ['AccountDBService', '$rootScope'];
  function AccountCacheService(AccountDBService, $rootScope)
  {
    let $ctrl = this;
    $ctrl.by_name = [];
    $ctrl.by_id   = [];

    AccountDBService.getAccounts().then(function(accounts) {
      //console.log('have accounts');
      $ctrl.by_name = accounts.by_name;
      $ctrl.by_id   = accounts.by_id;
      $rootScope.$broadcast('accountCache:loaded', $ctrl);
    }).catch(function (status) {
      console.log('getAccounts failed, status=', status);
    });

    $ctrl.getAccount = function(accountID)
    {
        return $ctrl.by_id[accountID];
    };

    $ctrl.getSortedList = function()
    {
      return $ctrl.by_name;
    }
  }
})();
