(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountCacheService', AccountCacheService);

  function makeAccountsByType(accounts)
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
    {
      byType[byType.types[i]].sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
    }

    return byType;
  }

  function makeAccountsByCategory(accounts)
  {
    let categoryDict = { undefined: [] };
    let categoriesByID = accounts.categories;

    for (let i = 0; i < categoriesByID.length; i++)
      if (categoriesByID[i]) categoryDict[categoriesByID[i].name] = [];

    for (let i = 0; i < accounts.by_id.length; i++)
      if (accounts.by_id[i])
      {
        let categoryName = 'undefined';
        if (accounts.by_id[i].category_id)
          categoryName = categoriesByID[accounts.by_id[i].category_id].name;
        categoryDict[categoryName].push(accounts.by_id[i]);
      }

    for (let category in categoryDict)
    {
      categoryDict[category].sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name === b.name) return 0;
        return 1; });
    }

    return categoryDict;
  }

  AccountCacheService.$inject = ['AccountDBService', '$rootScope'];
  function AccountCacheService(AccountDBService, $rootScope)
  {
    let $ctrl = this;
    $ctrl.by_name = [];
    $ctrl.by_id   = [];
    $ctrl.by_category = [];

    AccountDBService.getAccounts().then(function(accounts) {
      //console.log('have accounts');
      if (accounts)
      {
        //console.log('accounts=', accounts);
        $ctrl.by_id   = accounts.by_id;
        $ctrl.account_types = accounts.types;
        $ctrl.account_categories = accounts.categories;
        $ctrl.by_type = makeAccountsByType(accounts);
        $ctrl.by_category = makeAccountsByCategory(accounts);
        $rootScope.$broadcast('accountCache:loaded', $ctrl);
      }
    }).catch(function (status) {
      console.log('getAccounts failed, status=', status);
    });

    $ctrl.getAccount = function(accountID)
    { return $ctrl.by_id[accountID]; };

    $ctrl.getByType = function()
    { return $ctrl.by_type; }

    $ctrl.getByCategory = function()
    { return $ctrl.by_category; }
  }
})();
