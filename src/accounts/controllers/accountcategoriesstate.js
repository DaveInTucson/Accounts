(function ()
{
  'use strict';

  angular.module('Accounts')
    .controller('AccountCategoriesController', AccountCategoriesController);

  AccountCategoriesController.$inject = ['$scope', 'AccountCacheService'];
  function AccountCategoriesController($scope, AccountCacheService)
  {
    let $ctrl = this;
    setAccounts();

    $ctrl.categoryAccounts = function(categoryName)
    {
      return $ctrl.accounts[categoryName];
    };

    $ctrl.selectedCategoryAccounts = function()
    {
      return $ctrl.categoryAccounts($ctrl.getSelectedCategory().name);
    };

    function setAccounts()
    {
      $ctrl.accounts = AccountCacheService.getByCategory();
      $ctrl.categories = AccountCacheService.getCategories();

      if ($ctrl.accounts)
        $ctrl.categoryList = Object.keys($ctrl.accounts).sort();
      else
      {
          $ctrl.accounts = {};
          $ctrl.categoryList = [];
      }
    }

    $ctrl.getSelectedCategory = function()
    { return AccountCacheService.getCategory($ctrl.selectedCategoryID); };

    $ctrl.onSelectCategory = function()
    {
      if ($ctrl.selectedCategoryID)
      {
        let categories = AccountCacheService.getByCategory();
        let categoryName = $ctrl.getSelectedCategory().name;
      }
    };

    let cancelFn = $scope.$on('accountCache:loaded', function (event, service) {
      setAccounts();
    });

    $ctrl.$onDestroy = function()
    { cancelFn(); }
  }
})();
