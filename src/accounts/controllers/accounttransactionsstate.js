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
        if (transactions[i].from_id === transactionDetails.account_id)
          transactions[i].amount *= -1;

        pendingBalance += transactions[i].amount;
        if (transactions[i].status === 'cleared')
          clearedBalance += transactions[i].amount;
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
      //console.log('getOtherAccount(', transaction.date_posted, ')');
      if (transaction.from_id === $ctrl.transactionDetails.account_id)
      {
        //console.log('getOtherAccount(', transaction.date_posted, ') returns to account');
        return $ctrl.getAccount(transaction.to_id);
      }
      //console.log('getOtherAccount(', transaction.date_posted, ') returns from account');
      return $ctrl.getAccount(transaction.from_id);
    };
  };
})();
