(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountCacheService', AccountCacheService);

  AccountCacheService.$inject = ['AccountDBService'];
  function AccountCacheService(AccountDBService)
  {
    let $ctrl = this;
    $ctrl.accounts = [];

    AccountDBService.getAccounts().then(function(accounts) {
      $ctrl.accounts = accounts;
    });

    $ctrl.getAccount = function(accountID)
    {
        return $ctrl.accounts[accountID];
    }
  }
})();
