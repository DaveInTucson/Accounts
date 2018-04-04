(function ()
{
  'use strict';

  angular.module('Accounts')
    .controller('AccountTransactionsStateController', AccountTransactionsStateController);

  function computeBalances (transactionDetails)
  {
    let pendingBalance = transactionDetails.pending_balance;
    let clearedBalance = transactionDetails.cleared_balance;

    let transactions = transactionDetails.transactions;
    for (let i = 0; i < transactions.length; i++)
    {
      if (transactions[i].status !== 'void')
      {
        let amount = transactions[i].amount;
        if (transactions[i].from_id === transactionDetails.account_id)
          amount *= -1;

        pendingBalance += amount;
        if (transactions[i].status === 'cleared')
          clearedBalance += amount;
      }

      transactions[i].pendingBalance = pendingBalance;
      transactions[i].clearedBalance = clearedBalance;
    }
  }

  AccountTransactionsStateController.$inject = ['transactionDetails', 'AccountDBService'];
  function AccountTransactionsStateController(transactionDetails, AccountDBService)
  {
    let $ctrl = this;

    $ctrl.transactionDetails = transactionDetails;
    $ctrl.accounts = null;

    computeBalances(transactionDetails);
    AccountDBService.getAccounts().then(function(accounts) {
      $ctrl.accounts = [];
      for (let i = 0; i < accounts.length; i++)
      {
        $ctrl.accounts[accounts[i].id] = accounts[i];
      }
    });

    $ctrl.getAccount = function(accountID)
    {
      if ($ctrl.accounts) return $ctrl.accounts[accountID];
      return null;
    };

    $ctrl.getOtherAccount = function(transaction)
    {
      if (transaction.from_id === $ctrl.transactionDetails.accountid)
        return $ctrl.getAccount(transaction.to_id);
      return $ctrl.getAccount(transaction.from_id);
    };
  };
})();
