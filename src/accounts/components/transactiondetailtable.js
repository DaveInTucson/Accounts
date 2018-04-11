(function ()
{
  'use strict';

  angular.module('Accounts')
    .component('transactionDetailTable', {
        templateUrl: 'src/accounts/templates/transactionDetailTable.component.html',
        controller: TransactionDetailTableController,
        bindings: {
          transactions: '<',
          openingDate: '<',
          openingPendingBalance: '<',
          openingClearedBalance: '<',
        },
    });

  TransactionDetailTableController.$inject = ['AccountCacheService'];
  function TransactionDetailTableController(AccountCacheService)
  {
    let $ctrl = this;

    $ctrl.getOtherAccount = function(transaction)
    {
      return AccountCacheService.getAccount(transaction.other_account_id);
    }
  }
})();
