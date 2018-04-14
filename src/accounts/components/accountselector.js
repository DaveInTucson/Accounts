(function ()
{
  'use strict';

  angular.module('Accounts')
    .component('accountSelector', {
      templateUrl: 'src/accounts/templates/accountselector.component.html',
      controller: AccountSelectorComponentController,
    });


  AccountSelectorComponentController.$inject = ['AccountCacheService', '$scope', '$transitions', '$stateParams', '$state'];
  function AccountSelectorComponentController(AccountCacheService, $scope, $transitions, $stateParams, $state)
  {
    let $ctrl = this;

    $ctrl.accounts = AccountCacheService.getSortedList();

    let cancelFns = [], cancelFn;

    cancelFn = $scope.$on('accountCache:loaded', function (event, service) {
      $ctrl.accounts = service.getSortedList();
    });
    cancelFns.push(cancelFn);

      //console.log('$transitions=', $transitions);
    cancelFn = $transitions.onSuccess({}, function (transition) {
      let toState = transition.to().name;
      if (toState && toState === 'accountTransactions')
      {
        $ctrl.selectedAccount = $stateParams.accountID;
        $ctrl.selectedMonth = $stateParams.month;
      }
      else
      {
        $ctrl.selectedAccount = null;
        $ctrl.selectedMonth = null;
      }
    });
    cancelFns.push(cancelFn);

    $ctrl.accountTypes = function()
    {
      if (!$ctrl.accounts) return [];
      return Object.keys($ctrl.accounts).sort();
    };

    $ctrl.getAccounts = function(type)
    {
        if (!$ctrl.accounts) return [];
        return $ctrl.accounts[type];
    };

    $ctrl.onChange = function()
    {
      $state.go('accountTransactions', { accountID: $ctrl.selectedAccount });
    };

    $ctrl.$onDestroy = function()
    { cancelFn.forEach(function (fn) { fn(); }); };
  }
})();
