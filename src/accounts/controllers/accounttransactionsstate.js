(function ()
{
  'use strict';

  angular.module('Accounts')
    .controller('AccountTransactionsStateController', AccountTransactionsStateController);

  // this function annotates each transaction with some useful information that
  // will make it easier to do stuff like compute account balances, and find
  // the other account involved in the transaction
  function annotateTransactions(transactionDetails)
  {
    let transactions = transactionDetails.transactions;
    for (let i = 0; i < transactions.length; i++)
    {
      transactions[i].account_id = transactionDetails.account_id;
      if (transactionDetails.account_id === transactions[i].from_id)
      {
        transactions[i].relative_amount = -transactions[i].amount;
        transactions[i].other_account_id = transactions[i].to_id;
      }
      else if (transactionDetails.account_id === transactions[i].to_id)
      {
        transactions[i].relative_amount = transactions[i].amount;
        transactions[i].other_account_id = transactions[i].from_id;
      }
      else throw "this should never happen";
    }
  } // annotateTransactions

  // Compute running balances for each transaction. Note that this uses the 
  // relative_amount field, so annotateTransactions needs to be called before
  // this will produce useful results
  function computeBalances (transactionDetails)
  {
    let pendingBalance = transactionDetails.pending_balance;
    let clearedBalance = transactionDetails.cleared_balance;

    let transactions = transactionDetails.transactions;
    for (let i = 0; i < transactions.length; i++)
    {
      if (transactions[i].status !== 'void')
      {
        pendingBalance += transactions[i].relative_amount;
        if (transactions[i].status === 'cleared')
          clearedBalance += transactions[i].relative_amount;
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

    annotateTransactions($ctrl.transactionDetails);
    computeBalances($ctrl.transactionDetails);

    AccountDBService.getAccounts().then(function(accounts) {
      $ctrl.accounts = accounts;
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

    $ctrl.computeBalances = function()
    {

    }
  };
})();
