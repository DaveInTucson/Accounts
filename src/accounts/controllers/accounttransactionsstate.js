(function ()
{
  'use strict';

  angular.module('Accounts')
    .controller('AccountTransactionsStateController', AccountTransactionsStateController);

  let date_re  = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
  let monthNames = ['month 0',
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];

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
    let totalPendingDeposits = 0;
    let totalPendingWithdrawals = 0;
    let totalClearedDeposits = 0;
    let totalClearedWithdrawals = 0;

    let pendingBalance = transactionDetails.pending_balance;
    let clearedBalance = transactionDetails.cleared_balance;

    let transactions = transactionDetails.transactions;
    for (let i = 0; i < transactions.length; i++)
    {
      if (transactions[i].status !== 'void')
      {
        if (transactions[i].relative_amount < 0)
        {
          totalPendingWithdrawals += transactions[i].amount;
          if (transactions[i].status === 'cleared')
            totalClearedWithdrawals += transactions[i].amount;
        }
        else
        {
          totalPendingDeposits += transactions[i].amount;
          if (transactions[i].status === 'cleared')
            totalClearedDeposits += transactions[i].amount;
        }
      }

      transactions[i].pendingBalance = pendingBalance + totalPendingDeposits - totalPendingWithdrawals;
      transactions[i].clearedBalance = clearedBalance + totalClearedDeposits - totalClearedWithdrawals;
    }

    return {
      totalPendingDeposits: totalPendingDeposits,
      totalPendingWithdrawals: totalPendingWithdrawals,
      totalClearedDeposits: totalClearedDeposits,
      totalClearedWithdrawals: totalClearedWithdrawals,
    };
  }


  AccountTransactionsStateController.$inject = ['transactionDetails', 'AccountCacheService', '$scope'];
  function AccountTransactionsStateController(transactionDetails, AccountCacheService, $scope)
  {
    let $ctrl = this;

    $ctrl.transactionDetails = transactionDetails;

    annotateTransactions($ctrl.transactionDetails);
    let tallies = computeBalances($ctrl.transactionDetails);
    setTallies(tallies);

    $ctrl.getAccount = function(accountID)
    {
      return AccountCacheService.getAccount(accountID);
    };

    let cancelFn = $scope.$on('accountdetails:recomputeBalance', function ()
    {
      console.log('received accountdetails:recomputeBalance');
      setTallies(computeBalances($ctrl.transactionDetails));
    });

    $ctrl.getAccountTitle = function()
    {
      let date = $ctrl.transactionDetails.month;
      let matchInfo = date_re.exec(date);
      if (matchInfo)
      {
        let year = matchInfo[1];
        let monthNumber = parseInt(matchInfo[2]);
        let monthName = monthNames[monthNumber];
        if (null === monthName || undefined === monthName) monthName = "month " + monthNumber;
        date = monthName + ', ' + String(year);
      }

      let accountName = 'account ' + $ctrl.transactionDetails.account_id;
      let account = $ctrl.getAccount($ctrl.transactionDetails.account_id);
      if (account) accountName = account.name;
      return accountName + ' for ' + date;
    };

    $ctrl.$onDestroy = function()
    { cancelFn(); }

    function setTallies(tallies)
    {
      $ctrl.totalPendingDeposits = tallies.totalPendingDeposits;
      $ctrl.totalPendingWithdrawals = tallies.totalPendingWithdrawals;
      $ctrl.totalClearedDeposits = tallies.totalClearedDeposits;
      $ctrl.totalClearedWithdrawals = tallies.totalClearedWithdrawals;
    }
  };
})();
