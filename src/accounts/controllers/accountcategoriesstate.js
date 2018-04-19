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

    $ctrl.categoryAccounts = function(category)
    {
      return $ctrl.accounts[category];
    };

    function setAccounts()
    {
      $ctrl.accounts = AccountCacheService.getByCategory();
      if ($ctrl.accounts)
        $ctrl.categoryList = Object.keys($ctrl.accounts).sort();
      else
      {
          $ctrl.accounts = {};
          $ctrl.categoryList = [];
      }
    }

    let cancelFn = $scope.$on('accountCache:loaded', function (event, service) {
      setAccounts();
    });

    $ctrl.$onDestroy = function()
    { cancelFn(); }
  }
})();
