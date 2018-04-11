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


  AccountTransactionsStateController.$inject = ['transactionDetails', 'AccountCacheService', '$scope'];
  function AccountTransactionsStateController(transactionDetails, AccountCacheService, $scope)
  {
    let $ctrl = this;

    $ctrl.transactionDetails = transactionDetails;

    annotateTransactions($ctrl.transactionDetails);
    computeBalances($ctrl.transactionDetails);

    $ctrl.getAccount = function(accountID)
    {
      return AccountCacheService.getAccount(accountID);
    };

    $ctrl.getOtherAccount = function(transaction)
    {
      return $ctrl.getAccount(transaction.other_account_id);
    };

    let cancelFn = $scope.$on('accountdetails:recomputeBalance', function ()
    {
      console.log('received accountdetails:recomputeBalance');
      computeBalances($ctrl.transactionDetails);
    });

    $ctrl.$onDestroy = function()
    { cancelFn(); }
  };
})();
