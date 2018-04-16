(function ()
{
  'strict';

  angular.module('Accounts')
    .controller('DepositBalancesStateController', DepositBalancesStateController);

  DepositBalancesStateController.$inject = ['depositBalances'];
  function DepositBalancesStateController(depositBalances)
  {
    let $ctrl = this;

    $ctrl.depositBalances = depositBalances;
    computeTotals();

    function computeTotals()
    {
      $ctrl.pendingTotal = 0;
      $ctrl.clearedTotal = 0;
      for (let i = 0; i < $ctrl.depositBalances.length; i++)
      {
        $ctrl.pendingTotal += $ctrl.depositBalances[i].pending_balance;
        $ctrl.clearedTotal += $ctrl.depositBalances[i].cleared_balance;
      }
    }

  };

})();
