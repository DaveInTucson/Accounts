(function ()
{
  'use strict';

  angular.module('Accounts')
    .controller('AccountTransactionsStateController', AccountTransactionsStateController);

  AccountTransactionsStateController.$inject = ['transactionDetails'];
  function AccountTransactionsStateController(transactionDetails)
  {
    let $ctrl = this;

    $ctrl.transactionDetails = transactionDetails;
  };
})();
