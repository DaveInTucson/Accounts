(function ()
{
  'use strict';

  angular.module('DB')
    .service('AccountCacheService', AccountCacheService);

  function makeByID(a)
  {
    let byID = [];

    for (let i = 0; i < a.length; i++)
    {
      byID[a[i].id] = a[i];
    }

    return byID;
  }

  AccountCacheService.$inject = ['AccountDBService', '$rootScope'];
  function AccountCacheService(AccountDBService, $rootScope)
  {
    let $ctrl = this;
    $ctrl.by_name = [];
    $ctrl.by_id   = [];
    $ctrl.by_category = [];

    AccountDBService.getAccounts().then(function(accounts) {
      if (accounts)
      {
        //console.log('accounts=', accounts);
        $ctrl.accountsSorted   = accounts.sorted_accounts;
        $ctrl.categoriesSorted = accounts.sorted_categories;
        $ctrl.typeNames        = accounts.type_names

        $ctrl.accountsByID     = makeByID($ctrl.accountsSorted);
        $ctrl.categoriesByID   = makeByID($ctrl.categoriesSorted);

        $ctrl.accountsByType     = makeAccountsByType(accounts);
        $ctrl.accountsByCategory = makeAccountsByCategory(accounts);
        $rootScope.$broadcast('accountCache:loaded', $ctrl);
      }
    }).catch(function (status) {
      console.log('getAccounts failed, status=', status);
    });

    $ctrl.getAccount = function(accountID)
    { return $ctrl.accountsByID[accountID]; };

    $ctrl.getCategory = function(categoryID)
    { return $ctrl.categoriesByID[categoryID]; };
    
    $ctrl.getCategories = function()
    { return $ctrl.categoriesSorted; }

    $ctrl.getByType = function()
    { return $ctrl.accountsByType; }

    $ctrl.getByCategory = function()
    { return $ctrl.accountsByCategory; }

    function makeAccountsByType()
    {
      let byType = { types: $ctrl.typeNames }
      for (let i = 0; i < $ctrl.typeNames.length; i++)
      {
        byType[$ctrl.typeNames[i]] = [];
      }

      // 0 is not used, and there's no guarantee every ID will be in use
      for (let i = 0; i < $ctrl.accountsSorted.length; i++)
      {
        byType[$ctrl.accountsSorted[i].type].push($ctrl.accountsSorted[i]);
      }

      return byType;
    } // makeAccountsByType

    function makeAccountsByCategory()
    {
      let categoryDict = { undefined: [] };
      let categoriesSorted = $ctrl.categoriesSorted;

      for (let i = 0; i < categoriesSorted.length; i++)
        categoryDict[categoriesSorted[i].name] = [];

      for (let i = 0; i < $ctrl.accountsSorted.length; i++)
      {
        let categoryName = 'undefined';
        if ($ctrl.accountsSorted[i].category_id)
          categoryName = $ctrl.categoriesByID[$ctrl.accountsSorted[i].category_id].name;
        categoryDict[categoryName].push($ctrl.accountsSorted[i]);
      }

      return categoryDict;
    } // makeAccountsByCategory

  }
})();
