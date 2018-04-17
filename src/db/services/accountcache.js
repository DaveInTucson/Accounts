(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountCacheService', AccountCacheService);

  function makeSortedByType(accounts)
  {
    let byType = { types: accounts.types }
    for (let i = 0; i < accounts.types.length; i++)
    {
      byType[accounts.types[i]] = [];
    }

    // 0 is not used, and there's no guarantee every ID will be in use
    for (let i = 0; i < accounts.by_id.length; i++)
    {
      if (accounts.by_id[i]) {
        byType[accounts.by_id[i].type].push(accounts.by_id[i]);
      }
    }

    //console.log('sortedList=', sortedList);
    for (let i = 0; i < byType.types.length; i++)
      byType[byType.types[i]].sort(function (a, b) {
        return a.name < b.name;
      });

    return byType;
  }

  AccountCacheService.$inject = ['AccountDBService', '$rootScope'];
  function AccountCacheService(AccountDBService, $rootScope)
  {
    let $ctrl = this;
    $ctrl.by_name = [];
    $ctrl.by_id   = [];

    AccountDBService.getAccounts().then(function(accounts) {
      //console.log('have accounts');
      if (accounts)
      {
        //console.log('accounts=', accounts);
        $ctrl.by_id   = accounts.by_id;
        $ctrl.account_types = accounts.types;
        $ctrl.account_categories = accounts.categories;
        $ctrl.by_type = makeSortedByType(accounts);
        console.log('by_type=', $ctrl.by_type);
        $rootScope.$broadcast('accountCache:loaded', $ctrl);
      }
    }).catch(function (status) {
      console.log('getAccounts failed, status=', status);
    });

    $ctrl.getAccount = function(accountID)
    {
        return $ctrl.by_id[accountID];
    };

    $ctrl.getByType = function()
    {
      return $ctrl.by_type;
    }
  }
})();
